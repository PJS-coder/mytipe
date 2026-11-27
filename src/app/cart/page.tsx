import { Metadata } from "next";
import CartClient from "./CartClient";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";

export const metadata: Metadata = {
  title: "Shopping Cart | Mytipe Foot Care",
  description: "Review and manage your Mytipe therapeutic foot alignment socks and wellness items.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/cart`,
  },
};

export default function CartPage() {
  return <CartClient />;
}
