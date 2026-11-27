import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";

export const metadata: Metadata = {
  title: "Secure Checkout | Mytipe Foot Care",
  description: "Complete your order with 100% secure payment or Cash on Delivery across India.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/checkout`,
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
