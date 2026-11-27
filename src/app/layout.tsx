import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/common/ScrollToTop";
import StoreLayoutWrapper from "@/components/layout/StoreLayoutWrapper";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mytipe.com"),
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
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/logo.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#0f1c3f] selection:text-white">
        <AnalyticsScripts />
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

