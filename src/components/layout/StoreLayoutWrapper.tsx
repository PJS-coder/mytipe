"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SpinWheelModal from "@/components/rewards/SpinWheelModal";
import CoinFloatingWidget from "@/components/rewards/CoinFloatingWidget";
import AuthModal from "@/components/auth/AuthModal";

export default function StoreLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // In admin panel, render only the admin view with zero storefront clutter
  if (isAdmin) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SpinWheelModal />
      <CoinFloatingWidget />
      <AuthModal />
    </>
  );
}
