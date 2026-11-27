import { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "My Account & Live Order Tracking | Mytipe",
  description: "Track your Mytipe foot alignment socks order and manage your Mytipe Club reward coins.",
};

export default function AccountPage() {
  return <AccountClient />;
}
