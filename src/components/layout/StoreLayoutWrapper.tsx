"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CoinFloatingWidget from "@/components/rewards/CoinFloatingWidget";
import InitialPageLoader from "@/components/common/InitialPageLoader";
import ImagePreloader from "@/components/common/ImagePreloader";

// Code-split heavy interactive modals so they don't block critical page render
const SpinWheelModal = dynamic(() => import("@/components/rewards/SpinWheelModal"), {
  ssr: false,
});

const AuthModal = dynamic(() => import("@/components/auth/AuthModal"), {
  ssr: false,
});

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
      <InitialPageLoader />
      <ImagePreloader />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
      <Footer />
      <CartDrawer />
      <SpinWheelModal />
      <CoinFloatingWidget />
      <AuthModal />
    </>
  );
}
