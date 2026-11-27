import { CartLineItem, ShippingAddress } from "@/types/store";
import { getProductById, getProductByHandle } from "@/server/db/products";
import { calculateCartMilestones } from "@/lib/constants/cart";
import { sanitizeString, validatePhone, validatePincode, validateEmail } from "@/server/security/sanitize";

export interface VerifiedOrderData {
  customer: ShippingAddress;
  items: CartLineItem[];
  pricing: {
    subtotal: number;
    discount: number;
    coinDiscount: number;
    shippingFee: number;
    tax: number;
    total: number;
    currency: string;
  };
}

/**
 * Validates cart line items against the server-side product catalog,
 * sanitizes shipping fields, and calculates tamper-proof pricing.
 */
export function verifyAndCalculateOrder(
  rawCustomer: unknown,
  rawItems: unknown,
  rawCoinDiscount = 0
): { success: true; data: VerifiedOrderData } | { success: false; error: string } {
  // 1. Validate Customer
  if (!rawCustomer || typeof rawCustomer !== "object") {
    return { success: false, error: "Invalid customer information" };
  }

  const cust = rawCustomer as Record<string, unknown>;
  const fullName = sanitizeString(cust.fullName, 100);
  const addressLine1 = sanitizeString(cust.addressLine1, 200);
  const addressLine2 = sanitizeString(cust.addressLine2, 200);
  const city = sanitizeString(cust.city, 100);
  const state = sanitizeString(cust.state, 100) || "Delhi";

  const { valid: isPhoneValid, normalized: phone } = validatePhone(cust.phone);
  if (!isPhoneValid) {
    return { success: false, error: "Please enter a valid 10-digit mobile number" };
  }

  const { valid: isPincodeValid, normalized: pincode } = validatePincode(cust.pincode);
  if (!isPincodeValid) {
    return { success: false, error: "Please enter a valid 6-digit Indian PIN code" };
  }

  let email = "";
  if (cust.email) {
    const { valid: isEmailValid, normalized } = validateEmail(cust.email);
    if (isEmailValid) {
      email = normalized;
    }
  }
  if (!email) {
    email = `${phone}@mytipe.user`;
  }

  if (!fullName || fullName.length < 2) {
    return { success: false, error: "Please enter your full name" };
  }

  if (!addressLine1 || addressLine1.length < 5) {
    return { success: false, error: "Please enter a complete delivery address" };
  }

  const sanitizedCustomer: ShippingAddress = {
    fullName,
    phone,
    email,
    addressLine1,
    addressLine2,
    city: city || "New Delhi",
    state,
    pincode,
    country: "India",
  };

  // 2. Validate Items against Server Product Catalog
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  const verifiedItems: CartLineItem[] = [];
  let serverSubtotal = 0;

  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") continue;
    const item = rawItem as Record<string, unknown>;

    const quantity = Math.max(1, Math.min(20, parseInt(String(item.quantity || 1), 10)));
    const productId = String(item.productId || "");
    const handle = String(item.handle || "");
    const variantId = String(item.variantId || "");

    // Lookup real product from server database
    const dbProduct = getProductById(productId) || getProductByHandle(handle);
    if (!dbProduct) {
      return { success: false, error: `Product '${sanitizeString(item.title)}' is no longer available` };
    }

    if (!dbProduct.availableForSale) {
      return { success: false, error: `'${dbProduct.title}' is currently out of stock` };
    }

    // Find variant
    const dbVariant = dbProduct.variants.find((v) => v.id === variantId) || dbProduct.variants[0];
    const serverUnitPrice = parseFloat(dbVariant?.price?.amount || dbProduct.priceRange.minVariantPrice.amount);

    // Calculate line price (allow bundle discount if bundleTierId is present, but never below reasonable threshold)
    let effectiveUnitPrice = serverUnitPrice;
    const bundleTierId = item.bundleTierId ? String(item.bundleTierId) : undefined;

    if (bundleTierId === "bundle-4") {
      effectiveUnitPrice = Math.max(serverUnitPrice * 0.6, effectiveUnitPrice * 0.7);
    } else if (bundleTierId === "bundle-2") {
      effectiveUnitPrice = Math.max(serverUnitPrice * 0.7, effectiveUnitPrice * 0.85);
    }

    const itemSubtotal = effectiveUnitPrice * quantity;
    serverSubtotal += itemSubtotal;

    verifiedItems.push({
      id: sanitizeString(item.id || `${dbProduct.id}-${Date.now()}`),
      productId: dbProduct.id,
      handle: dbProduct.handle,
      variantId: dbVariant?.id || `var-${dbProduct.id}`,
      title: dbProduct.title,
      variantTitle: dbVariant?.title || "Standard",
      price: {
        amount: effectiveUnitPrice.toFixed(2),
        currencyCode: "INR",
      },
      image: {
        url: dbProduct.featuredImage.url,
        altText: dbProduct.featuredImage.altText || dbProduct.title,
      },
      selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
      quantity,
      bundleTierId,
      discountBadge: item.discountBadge ? sanitizeString(item.discountBadge, 50) : undefined,
    });
  }

  if (verifiedItems.length === 0) {
    return { success: false, error: "No valid items in cart" };
  }

  // 3. Calculate Milestones, Shipping, Coins, and Total
  const { tierDiscount, isCheckoutUnlocked } = calculateCartMilestones(serverSubtotal);
  const shippingFee = isCheckoutUnlocked ? 0 : 50;

  const numericCoinDiscount = typeof rawCoinDiscount === "number" ? rawCoinDiscount : 0;
  const validCoinDiscount = Math.min(
    Math.max(0, numericCoinDiscount),
    Math.max(0, serverSubtotal - tierDiscount)
  );

  const total = Math.max(0, serverSubtotal - tierDiscount - validCoinDiscount + shippingFee);

  return {
    success: true,
    data: {
      customer: sanitizedCustomer,
      items: verifiedItems,
      pricing: {
        subtotal: Math.round(serverSubtotal),
        discount: tierDiscount,
        coinDiscount: validCoinDiscount,
        shippingFee,
        tax: 0,
        total: Math.round(total),
        currency: "INR",
      },
    },
  };
}
