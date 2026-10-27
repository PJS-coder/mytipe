import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/common/ScrollToTop";
import StoreLayoutWrapper from "@/components/layout/StoreLayoutWrapper";


export const metadata: Metadata = {
  title: {
    default: "Mytipe™ | Relax & Realign Your Feet with Foot Alignment Socks",
    template: "%s | Mytipe",
  },
  description:
    "Original anatomical Foot Alignment Socks for natural toe separation, plantar fasciitis relief, bunions, and daily foot comfort. Free Cash on Delivery across India.",
  keywords: [
    "foot alignment socks",
    "toe separators",
    "plantar fasciitis relief",
    "bunion corrector",
    "Mytipe socks",
    "foot care",
  ],
  openGraph: {
    title: "Mytipe™ | Relax & Realign Your Feet",
    description: "Plush therapeutic foot alignment socks. Over 300,000+ pairs sold with 4.9 star rating.",
    url: "https://mytipe.com",
    siteName: "Mytipe",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#0f1c3f] selection:text-white">
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

