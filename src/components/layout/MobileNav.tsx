"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronDown,
  Phone,
  User as UserIcon,
  LogOut,
  Search,
  ShoppingBag,
  Coins,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { totalQuantity, openCart } = useCart();
  const [shopOpen, setShopOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery("");
    }
  };

  const handleOpenCart = () => {
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[300px] sm:max-w-xs bg-white text-gray-900 shadow-xl z-10 flex flex-col h-full animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-14 px-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo.png"
                alt="Mytipe Logo"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-base text-gray-900 tracking-tight">MYTIPE</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div className="px-4 py-2.5 border-b border-gray-100 shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-gray-400 transition"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 text-sm font-medium text-gray-800">
          {/* 1. Mytipe club */}
          <Link
            href="/mytipe-club"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            <span>Mytipe club</span>
          </Link>

          {/* 2. Make your care can */}
          <Link
            href="/make-your-care-can"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            <span>Make your care can</span>
          </Link>

          {/* 3. Our super hero */}
          <Link
            href="/products/foot-shoe-deo"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            <span>Our super hero</span>
          </Link>

          {/* 4. Shop Section with collapsible submenu */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShopOpen(!shopOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition text-left cursor-pointer font-medium"
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  shopOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {shopOpen && (
              <div className="ml-3 pl-3 border-l border-gray-200 my-1 space-y-0.5 text-[13px] text-gray-600">
                <Link
                  href="/collections/all-socks"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition font-semibold text-gray-900"
                >
                  Shop All
                </Link>
                <Link
                  href="/collections/rakhi-gift-for-brothers"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Rakhi Gift For Brothers
                </Link>
                <Link
                  href="/collections/mytipe-foot-care-kits"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Mytipe Foot Care Kits
                </Link>
                <Link
                  href="/collections/gym-socks"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Gym Socks
                </Link>
                <Link
                  href="/products/pain-relief-socks"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Pain Relief Socks
                </Link>
                <Link
                  href="/collections/diabetic-socks"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Diabetic Socks
                </Link>
                <Link
                  href="/collections/office-socks"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Office Socks
                </Link>
                <Link
                  href="/collections/designer-socks"
                  onClick={onClose}
                  className="block px-2.5 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-50 transition"
                >
                  Designer Socks
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100 my-2 space-y-0.5">
            {/* Account / Track orders */}
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition"
            >
              <span>Account &amp; Orders</span>
            </Link>

            {/* Cart trigger */}
            <button
              type="button"
              onClick={handleOpenCart}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gray-500" />
                <span>Cart</span>
              </div>
              {totalQuantity > 0 && (
                <span className="text-xs bg-gray-900 text-white font-semibold px-2 py-0.5 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Minimal User & Footer Strip */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 shrink-0 text-xs">
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-500">{user.phone ? `+91 ${user.phone}` : user.email}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>{user.coins}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-gray-500">
                <a href="tel:7310585356" className="flex items-center gap-1 hover:text-gray-800">
                  <Phone className="w-3 h-3" />
                  <span>+91 7310585356</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="w-full py-2 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Login</span>
              </button>
              <div className="flex items-center justify-between text-gray-500 pt-0.5">
                <a href="tel:7310585356" className="flex items-center gap-1 hover:text-gray-700">
                  <Phone className="w-3 h-3" />
                  <span>+91 7310585356</span>
                </a>
                <Link href="/account" onClick={onClose} className="hover:text-gray-900 font-medium">
                  Track Order
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


