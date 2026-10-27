import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Money } from "@/types/store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number | string | Money | undefined,
  currencyCode: string = "INR"
): string {
  if (amount === undefined || amount === null) return "₹0";

  let num: number;
  if (typeof amount === "object" && "amount" in amount) {
    num = parseFloat(amount.amount);
  } else if (typeof amount === "string") {
    num = parseFloat(amount);
  } else {
    num = amount;
  }

  if (isNaN(num)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(num);
}

export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Optimizes image URLs for ultra-fast loading:
 * 1. Automatically requests Shopify CDN images at the exact display width in WebP format
 * 2. Swaps heavy local assets with lightweight WebP versions
 */
export function getOptimizedImageUrl(url: string | undefined | null, width: number = 600): string {
  if (!url) return "/heros.webp";

  // Check if it's one of our optimized local WebP assets
  if (url.startsWith("/") && url.endsWith(".png")) {
    const webpPath = url.replace(/\.png$/, ".webp");
    if (
      [
        "/heros.webp",
        "/brave.webp",
        "/gym-sock.webp",
        "/office-sock.webp",
        "/pain-sock.webp",
        "/foot&shoedeo.webp",
        "/carecan-hero.webp",
        "/hero-can.webp",
      ].includes(webpPath)
    ) {
      return webpPath;
    }
  }

  // Shopify CDN: append width & format=webp so Cloudflare serves small WebP directly
  if (url.includes("cdn.shopify.com")) {
    const cleanUrl = url.split("?")[0];
    return `${cleanUrl}?width=${width}&format=webp`;
  }

  return url;
}
