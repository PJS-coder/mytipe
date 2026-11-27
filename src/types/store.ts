export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice?: Money | null;
  image?: ProductImage;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductBundleTier {
  id: string;
  pairs: number;
  title: string;
  badge?: string;
  isPopular?: boolean;
  pricePerPair: number;
  totalPrice: number;
  compareAtPrice: number;
  discountPercentage: number;
  savings: number;
}

export interface ProductReview {
  id: string;
  author: string;
  isVerified: boolean;
  rating: number;
  date: string;
  title?: string;
  content: string;
  colorPurchased?: string;
  image?: string;
  likes?: number;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: ProductImage;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  tags: string[];
  collections?: string[];
  rating: {
    average: number;
    count: number;
  };
  bundles?: ProductBundleTier[];
  banner?: ProductImage;
  highlights?: string[];
  painReliefPoints?: {
    title: string;
    description: string;
    icon: string;
  }[];
  clinicalStats?: {
    percentage: string;
    label: string;
    description: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
  productsCount?: number;
  productHandles?: string[];
}

export interface CartLineItem {
  id: string;
  variantId: string;
  productId: string;
  handle: string;
  title: string;
  variantTitle: string;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice?: Money | null;
  image: ProductImage;
  quantity: number;
  bundleTierId?: string;
  discountBadge?: string;
}

export interface Cart {
  id: string;
  checkoutUrl?: string;
  lines: CartLineItem[];
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalSavingsAmount: Money;
  };
}

// Customer & Order Types for Razorpay and COD Backend
export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "placed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
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
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  shiprocket?: {
    orderId?: number;
    shipmentId?: number;
    awbCode?: string;
    courierName?: string;
    status?: string;
    trackingUrl?: string;
    syncedAt?: string;
    error?: string;
  };
  createdAt: string;
  estimatedDelivery: string;
}
