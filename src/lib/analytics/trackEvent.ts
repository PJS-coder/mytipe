"use client";

import { CartLineItem, Product, ProductVariant } from "@/types/store";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1671422437853807";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TCXB3M36";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
    __mytipe_event_dedupe__?: Map<string, number>;
    __mytipe_last_pageview__?: string;
    __mytipe_initial_fbq_sent__?: boolean;
  }
}

const SENSITIVE_KEYS = new Set([
  "password",
  "pass",
  "secret",
  "token",
  "otp",
  "phone",
  "mobile",
  "email",
  "address",
  "street",
  "pincode",
  "zip",
  "card",
  "cvv",
  "razorpaySignature",
  "signature",
]);

const GA4_ECOMMERCE_EVENTS = new Set([
  "view_item",
  "add_to_cart",
  "remove_from_cart",
  "view_cart",
  "begin_checkout",
  "purchase",
  "view_item_list",
  "select_item",
]);

export interface TrackEventOptions {
  /** Standard Meta Pixel event name (e.g. 'ViewContent', 'AddToCart', 'Purchase') */
  metaEvent?: string;
  /** Custom Meta Pixel event name if not a standard Meta event */
  metaCustomEvent?: string;
  /** Parameters forwarded to Meta Pixel */
  metaParams?: Record<string, unknown>;
  /** Deduplication key to prevent accidental double-firing */
  dedupeKey?: string;
  /** Deduplication window in ms (default 600ms) */
  dedupeWindowMs?: number;
}

export function initDataLayer(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
}

function sanitizeParams(params: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(params)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase()) || val === undefined) continue;
    clean[key] = val;
  }
  return clean;
}

function isDuplicateEvent(dedupeKey: string | undefined, windowMs = 600): boolean {
  if (typeof window === "undefined" || !dedupeKey) return false;
  if (!window.__mytipe_event_dedupe__) {
    window.__mytipe_event_dedupe__ = new Map<string, number>();
  }
  const now = Date.now();
  const prev = window.__mytipe_event_dedupe__.get(dedupeKey);
  if (prev && now - prev < windowMs) {
    return true;
  }
  window.__mytipe_event_dedupe__.set(dedupeKey, now);

  // Prune stale keys periodically
  if (window.__mytipe_event_dedupe__.size > 100) {
    for (const [k, ts] of window.__mytipe_event_dedupe__.entries()) {
      if (now - ts > 10000) window.__mytipe_event_dedupe__.delete(k);
    }
  }
  return false;
}

/**
 * Centralized event tracking helper.
 * Pushes structured events to window.dataLayer (for GTM / GA4)
 * and optionally triggers Meta Pixel (fbq) standard or custom events.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  options: TrackEventOptions = {}
): void {
  if (typeof window === "undefined") return;

  try {
    const dedupeKey = options.dedupeKey || `${eventName}:${params.button_name || ""}:${params.product_id || ""}`;
    if (isDuplicateEvent(dedupeKey, options.dedupeWindowMs ?? 500)) {
      return;
    }

    initDataLayer();

    const cleanParams = sanitizeParams(params);
    const payload: Record<string, unknown> = {
      event: eventName,
      page_name: typeof document !== "undefined" ? document.title : "",
      page_url: window.location.href,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...cleanParams,
    };

    if (GA4_ECOMMERCE_EVENTS.has(eventName)) {
      window.dataLayer!.push({ ecommerce: null });
    }
    window.dataLayer!.push(payload);

    // Fire Meta Pixel event safely if loaded
    if (typeof window.fbq === "function") {
      if (options.metaEvent) {
        window.fbq("track", options.metaEvent, options.metaParams || {});
      } else if (options.metaCustomEvent) {
        window.fbq("trackCustom", options.metaCustomEvent, options.metaParams || cleanParams);
      }
    }
  } catch {
    // Never allow analytics errors to interrupt storefront UX
  }
}

export function trackPageView(pathname: string, search = ""): void {
  if (typeof window === "undefined") return;
  const fullPath = search ? `${pathname}?${search}` : pathname;
  if (window.__mytipe_last_pageview__ === fullPath) return;
  window.__mytipe_last_pageview__ = fullPath;

  // Initial Meta Pixel PageView is sent by the base script; only send on subsequent SPA transitions
  const shouldSendMetaPageView = Boolean(window.__mytipe_initial_fbq_sent__);
  window.__mytipe_initial_fbq_sent__ = true;

  trackEvent(
    "page_view",
    {
      page_path: pathname,
      page_location: window.location.href,
      page_title: typeof document !== "undefined" ? document.title : "",
    },
    {
      metaEvent: shouldSendMetaPageView ? "PageView" : undefined,
      dedupeKey: `page_view:${fullPath}`,
      dedupeWindowMs: 1000,
    }
  );
}

export function trackClick(
  buttonName: string,
  buttonLocation: string,
  extraParams: Record<string, unknown> = {}
): void {
  trackEvent(
    "button_click",
    {
      button_name: buttonName,
      button_location: buttonLocation,
      element_type: extraParams.element_type || "button",
      ...extraParams,
    },
    {
      dedupeKey: `click:${buttonLocation}:${buttonName}`,
      dedupeWindowMs: 400,
    }
  );
}

export function trackViewItem(product: Product, variant?: ProductVariant): void {
  const price = parseFloat(variant?.price?.amount || product.priceRange.minVariantPrice.amount) || 0;
  trackEvent(
    "view_item",
    {
      product_id: product.id,
      product_name: product.title,
      product_handle: product.handle,
      variant_id: variant?.id,
      variant_name: variant?.title,
      ecommerce: {
        currency: "INR",
        value: price,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_variant: variant?.title || "Standard",
            price,
            quantity: 1,
          },
        ],
      },
    },
    {
      metaEvent: "ViewContent",
      metaParams: {
        content_ids: [product.id],
        content_name: product.title,
        content_type: "product",
        value: price,
        currency: "INR",
      },
      dedupeKey: `view_item:${product.id}:${variant?.id || "default"}`,
      dedupeWindowMs: 1500,
    }
  );
}

export function trackAddToCart(
  product: Product,
  variant: ProductVariant,
  quantity: number
): void {
  const unitPrice = parseFloat(variant?.price?.amount || product.priceRange.minVariantPrice.amount) || 0;
  const totalValue = Number((unitPrice * quantity).toFixed(2));

  trackEvent(
    "add_to_cart",
    {
      product_id: product.id,
      product_name: product.title,
      variant_id: variant.id,
      variant_name: variant.title,
      quantity,
      value: totalValue,
      currency: "INR",
      ecommerce: {
        currency: "INR",
        value: totalValue,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_variant: variant.title,
            price: unitPrice,
            quantity,
          },
        ],
      },
    },
    {
      metaEvent: "AddToCart",
      metaParams: {
        content_ids: [product.id],
        content_name: product.title,
        content_type: "product",
        value: totalValue,
        currency: "INR",
        num_items: quantity,
      },
      dedupeKey: `add_to_cart:${product.id}:${variant.id}:${quantity}`,
      dedupeWindowMs: 400,
    }
  );
}

export function trackRemoveFromCart(item: CartLineItem): void {
  const unitPrice = parseFloat(item.price.amount) || 0;
  const totalValue = Number((unitPrice * item.quantity).toFixed(2));
  trackEvent("remove_from_cart", {
    product_id: item.productId,
    product_name: item.title,
    variant_id: item.variantId,
    quantity: item.quantity,
    value: totalValue,
    currency: "INR",
    ecommerce: {
      currency: "INR",
      value: totalValue,
      items: [
        {
          item_id: item.productId,
          item_name: item.title,
          item_variant: item.variantTitle,
          price: unitPrice,
          quantity: item.quantity,
        },
      ],
    },
  });
}

export function trackViewCart(items: CartLineItem[], subtotal: number): void {
  trackEvent("view_cart", {
    value: Number(subtotal.toFixed(2)),
    currency: "INR",
    items_count: items.reduce((sum, i) => sum + i.quantity, 0),
    ecommerce: {
      currency: "INR",
      value: Number(subtotal.toFixed(2)),
      items: items.map((i) => ({
        item_id: i.productId,
        item_name: i.title,
        item_variant: i.variantTitle,
        price: parseFloat(i.price.amount) || 0,
        quantity: i.quantity,
      })),
    },
  });
}

export function trackBeginCheckout(items: CartLineItem[], total: number): void {
  const numItems = items.reduce((sum, i) => sum + i.quantity, 0);
  trackEvent(
    "begin_checkout",
    {
      value: Number(total.toFixed(2)),
      currency: "INR",
      items_count: numItems,
      ecommerce: {
        currency: "INR",
        value: Number(total.toFixed(2)),
        items: items.map((i) => ({
          item_id: i.productId,
          item_name: i.title,
          item_variant: i.variantTitle,
          price: parseFloat(i.price.amount) || 0,
          quantity: i.quantity,
        })),
      },
    },
    {
      metaEvent: "InitiateCheckout",
      metaParams: {
        content_ids: items.map((i) => i.productId),
        num_items: numItems,
        value: Number(total.toFixed(2)),
        currency: "INR",
      },
      dedupeKey: `begin_checkout:${items.length}:${total.toFixed(0)}`,
      dedupeWindowMs: 2000,
    }
  );
}

export function trackPurchase(
  orderId: string,
  items: CartLineItem[],
  total: number,
  paymentMethod: string
): void {
  if (typeof window !== "undefined") {
    try {
      const storageKey = `mytipe_tracked_purchase_${orderId}`;
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore storage errors
    }
  }

  trackEvent(
    "purchase",
    {
      transaction_id: orderId,
      payment_method: paymentMethod,
      value: Number(total.toFixed(2)),
      currency: "INR",
      ecommerce: {
        transaction_id: orderId,
        currency: "INR",
        value: Number(total.toFixed(2)),
        items: items.map((i) => ({
          item_id: i.productId,
          item_name: i.title,
          item_variant: i.variantTitle,
          price: parseFloat(i.price.amount) || 0,
          quantity: i.quantity,
        })),
      },
    },
    {
      metaEvent: "Purchase",
      metaParams: {
        content_ids: items.map((i) => i.productId),
        content_type: "product",
        num_items: items.reduce((sum, i) => sum + i.quantity, 0),
        value: Number(total.toFixed(2)),
        currency: "INR",
      },
      dedupeKey: `purchase:${orderId}`,
      dedupeWindowMs: 60000,
    }
  );
}

export function trackSearch(searchTerm: string, resultsCount?: number): void {
  const cleanTerm = searchTerm.trim();
  if (!cleanTerm) return;
  trackEvent(
    "search",
    {
      search_term: cleanTerm,
      results_count: resultsCount,
    },
    {
      metaEvent: "Search",
      metaParams: {
        search_string: cleanTerm,
      },
      dedupeKey: `search:${cleanTerm.toLowerCase()}`,
      dedupeWindowMs: 800,
    }
  );
}
