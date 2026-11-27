import { Order } from "@/types/store";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export const isShiprocketConfigured = Boolean(
  process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD
);

declare global {
  var __shiprocket_token__: { token: string; expiresAt: number } | undefined;
  var __shiprocket_pickup__: string | undefined;
}

export interface ShiprocketCreateResult {
  success: boolean;
  orderId?: number;
  shipmentId?: number;
  awbCode?: string;
  courierName?: string;
  status?: string;
  error?: string;
}

export interface ShiprocketTrackingResult {
  success: boolean;
  awbCode?: string;
  courierName?: string;
  status?: string;
  trackingUrl?: string;
  error?: string;
}

/**
 * Authenticates with Shiprocket API using API User credentials from env.
 * Caches token in memory for 9 days (Shiprocket tokens last 10 days).
 */
export async function getShiprocketToken(forceRefresh = false): Promise<string> {
  if (!isShiprocketConfigured) {
    throw new Error("Shiprocket credentials (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD) are not configured");
  }

  const cached = global.__shiprocket_token__;
  if (!forceRefresh && cached && Date.now() < cached.expiresAt) {
    return cached.token;
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(data?.message || `Shiprocket auth failed (${res.status})`);
  }

  global.__shiprocket_token__ = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000, // 9 days
  };

  return data.token;
}

async function getPickupLocationName(token: string): Promise<string> {
  if (process.env.SHIPROCKET_PICKUP_LOCATION) {
    return process.env.SHIPROCKET_PICKUP_LOCATION;
  }
  if (global.__shiprocket_pickup__) {
    return global.__shiprocket_pickup__;
  }

  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/settings/company/pickup`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const addresses = data?.data?.shipping_address;
    if (Array.isArray(addresses) && addresses.length > 0 && addresses[0]?.pickup_location) {
      global.__shiprocket_pickup__ = addresses[0].pickup_location;
      return addresses[0].pickup_location;
    }
  } catch (err) {
    console.warn("Shiprocket pickup location lookup failed, using 'Primary':", err);
  }

  return "Primary";
}

function formatShiprocketDate(isoString: string): string {
  const date = new Date(isoString || Date.now());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Creates an adhoc order in Shiprocket for an existing storefront Order.
 */
export async function createShiprocketOrder(order: Order): Promise<ShiprocketCreateResult> {
  if (!isShiprocketConfigured) {
    return { success: false, error: "Shiprocket credentials not configured" };
  }

  try {
    let token = await getShiprocketToken();
    const pickupLocation = await getPickupLocationName(token);

    const nameParts = (order.customer.fullName || "Customer").trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || ".";

    const cleanPhone = (order.customer.phone || "").replace(/\D/g, "").slice(-10);

    const payload = {
      order_id: order.orderNumber || order.id,
      order_date: formatShiprocketDate(order.createdAt),
      pickup_location: pickupLocation,
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.customer.addressLine1,
      billing_address_2: order.customer.addressLine2 || "",
      billing_city: order.customer.city,
      billing_pincode: order.customer.pincode,
      billing_state: order.customer.state,
      billing_country: order.customer.country || "India",
      billing_email: order.customer.email,
      billing_phone: cleanPhone,
      shipping_is_billing: true,
      order_items: order.items.map((item) => ({
        name: `${item.title} (${item.variantTitle || "Standard"})`,
        sku: item.variantId || item.productId || item.handle,
        units: item.quantity || 1,
        selling_price: parseFloat(item.price.amount) || 499,
        discount: 0,
        tax: 0,
      })),
      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
      shipping_charges: order.pricing.shippingFee || 0,
      total_discount: (order.pricing.discount || 0) + (order.pricing.coinDiscount || 0),
      sub_total: order.pricing.total,
      length: 20,
      breadth: 15,
      height: 6,
      weight: Math.max(0.25, Number((0.15 * order.items.reduce((s, i) => s + i.quantity, 0)).toFixed(2))),
    };

    let res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Retry once with refreshed token if 401
    if (res.status === 401) {
      token = await getShiprocketToken(true);
      res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();
    if (!res.ok || !data?.order_id) {
      return {
        success: false,
        error: data?.message || `Shiprocket order creation failed (${res.status})`,
      };
    }

    return {
      success: true,
      orderId: data.order_id,
      shipmentId: data.shipment_id,
      awbCode: data.awb_code || undefined,
      courierName: data.courier_name || undefined,
      status: data.status || "NEW",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Shiprocket request failed";
    return { success: false, error: message };
  }
}

/**
 * Fetches live shipment tracking status from Shiprocket by shipmentId or AWB.
 */
export async function trackShiprocketShipment(params: {
  shipmentId?: number;
  awbCode?: string;
}): Promise<ShiprocketTrackingResult> {
  if (!isShiprocketConfigured) {
    return { success: false, error: "Shiprocket credentials not configured" };
  }

  try {
    const token = await getShiprocketToken();
    const endpoint = params.awbCode
      ? `${SHIPROCKET_BASE_URL}/courier/track/awb/${encodeURIComponent(params.awbCode)}`
      : params.shipmentId
      ? `${SHIPROCKET_BASE_URL}/courier/track/shipment/${params.shipmentId}`
      : "";

    if (!endpoint) {
      return { success: false, error: "Missing shipmentId or awbCode" };
    }

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const td = data?.tracking_data;

    if (!res.ok || !td) {
      return {
        success: false,
        error: data?.message || `Tracking unavailable (${res.status})`,
      };
    }

    const shipmentTrack = Array.isArray(td.shipment_track) ? td.shipment_track[0] : undefined;
    return {
      success: true,
      awbCode: shipmentTrack?.awb_code || params.awbCode,
      courierName: shipmentTrack?.courier_name,
      status: shipmentTrack?.current_status || td.track_status ? String(shipmentTrack?.current_status || "IN_TRANSIT") : undefined,
      trackingUrl: td.track_url || undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Shiprocket tracking error";
    return { success: false, error: message };
  }
}

/**
 * Checks courier serviceability & estimated delivery for a customer PIN code.
 */
export async function checkShiprocketServiceability(
  pickupPincode: string,
  deliveryPincode: string,
  cod = true,
  weightKg = 0.25
) {
  if (!isShiprocketConfigured) return null;
  try {
    const token = await getShiprocketToken();
    const qs = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: deliveryPincode,
      cod: cod ? "1" : "0",
      weight: String(weightKg),
    });
    const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/serviceability/?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return null;
  }
}
