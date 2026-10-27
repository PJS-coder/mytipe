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
