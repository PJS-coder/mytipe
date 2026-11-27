import { Metadata } from "next";
import OrderSuccessClient from "./OrderSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmation | Mytipe",
  description: "Thank you for your order. Your therapeutic foot care package is being prepared.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
