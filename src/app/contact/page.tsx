import { Metadata } from "next";
import ContactClient from "./ContactClient";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com";

export const metadata: Metadata = {
  title: "Contact Us | Mytipe Customer Support",
  description:
    "Get in touch with the Mytipe team for order assistance, returns, shipping queries, or bulk inquiries. Quick support on WhatsApp, phone, and email.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Mytipe Customer Support",
    description:
      "Get in touch with Mytipe for customer support, shipping queries, or order tracking.",
    url: `${baseUrl}/contact`,
    siteName: "Mytipe",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
