"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingBag,
  User as UserIcon,
  X,
  ChevronDown,
  Sparkles,
  Coins,
  LogOut,
  Gift,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const router = useRouter();
  const { totalQuantity, openCart } = useCart();
  const { user, isAuthenticated, logout, openAuthModal, openSpinWheel, hasClaimedWelcomeSpin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="relative flex items-center justify-between h-14 sm:h-16 xl:h-18">
            {/* 1. LEFT SIDE: Mobile Menu Toggle / Desktop Left Nav Links */}
            <div className="flex-1 flex items-center justify-start gap-4 lg:gap-8">
              {/* Mobile Menu & Search buttons */}
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 -ml-2 text-gray-700 hover:text-gray-900 rounded-md cursor-pointer"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-700 hover:text-gray-900 cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Left Nav Items */}
              <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-base xl:text-lg font-bold tracking-wide text-gray-800">
                {/* 1. Mytipe club */}
                <Link
                  href="/mytipe-club"
                  className="hover:text-blue-600 transition flex items-center gap-1.5 whitespace-nowrap hover:scale-105 transform duration-150"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Mytipe club</span>
                </Link>

                {/* 2. Make your care can */}
                <Link
                  href="/make-your-care-can"
                  className="hover:text-blue-600 transition whitespace-nowrap hover:scale-105 transform duration-150"
                >
                  Make your care can
                </Link>
              </nav>
            </div>

            {/* 2. CENTER: Large Centered Brand Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center group transition-transform duration-300 hover:scale-105"
                aria-label="Mytipe Home"
              >
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Mytipe Logo"
                    fill
                    sizes="(max-width: 640px) 40px, (max-width: 1024px) 44px, 48px"
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* 3. RIGHT SIDE: Desktop Right Nav Links + Utility Icons + Account/Coins */}
            <div className="flex-1 flex items-center justify-end gap-3 sm:gap-5 xl:gap-7">
              {/* Desktop Right Nav Items */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-base xl:text-lg font-bold tracking-wide text-gray-800">
                {/* Our super hero */}
                <Link
                  href="/products/foot-shoe-deo"
                  className="hover:text-blue-600 transition whitespace-nowrap hover:scale-105 transform duration-150"
                >
                  Our super hero
                </Link>

                {/* Shop with Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShopDropdownOpen(true)}
                  onMouseLeave={() => setShopDropdownOpen(false)}
                >
                  <Link
                    href="/collections/all-socks"
                    className="flex items-center gap-1 hover:text-blue-600 transition py-2 whitespace-nowrap hover:scale-105 transform duration-150"
                  >
                    <span>Shop</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Link>

                  {shopDropdownOpen && (
                    <div className="absolute right-0 top-full pt-2 w-64 animate-in fade-in zoom-in-95 duration-150 z-50">
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-2 space-y-0.5">
                        <Link
                          href="/collections/rakhi-gift-for-brothers"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Rakhi Gift For Brothers
                        </Link>
                        <Link
                          href="/collections/mytipe-foot-care-kits"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Mytipe Foot Care Kits
                        </Link>
                        <Link
                          href="/collections/gym-socks"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Gym Socks
                        </Link>
                        <Link
                          href="/products/pain-relief-socks"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Pain Relief Socks
                        </Link>
                        <Link
                          href="/collections/diabetic-socks"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Diabetic Socks
                        </Link>
                        <Link
                          href="/collections/office-socks"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Office Socks
                        </Link>
                        <Link
                          href="/collections/designer-socks"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-950 hover:bg-slate-50 transition"
                        >
                          Designer Socks
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              {/* Utility Action Icons (Search, Account/Coins, Cart) */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search trigger */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="hidden lg:flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Account / Coins Pill Trigger */}
                {isAuthenticated && user ? (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-300/90 rounded-full text-xs font-black text-amber-950 transition-all duration-150 hover:scale-105 shadow-xs cursor-pointer"
                      aria-label="User Account and Coins"
                    >
                      <Coins className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                      <span className="font-extrabold">{user.coins} Coins</span>
                      <ChevronDown className="w-3 h-3 text-amber-800 shrink-0 opacity-70" />
                    </button>

                    {/* User Dropdown Menu */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {/* User Header */}
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">+91 {user.phone}</p>
                          <div className="mt-2 flex items-center justify-between p-2 bg-amber-50 rounded-xl border border-amber-200/60">
                            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-600" />
                              Coin Balance:
                            </span>
                            <span className="text-xs font-black text-amber-900">{user.coins} Coins</span>
                          </div>
                        </div>

                        {/* Welcome Gift trigger if unclaimed */}
                        {!hasClaimedWelcomeSpin && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              openSpinWheel();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition cursor-pointer text-left mb-1"
                          >
                            <Gift className="w-4 h-4 text-amber-600" />
                            <span>Claim Welcome Gift Spin</span>
                          </button>
                        )}

                        {/* Sign Out */}
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white text-xs font-bold uppercase tracking-wider rounded-full transition shadow-xs cursor-pointer hover:scale-105"
                    aria-label="Sign in"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </button>
                )}

                {/* Cart Drawer Trigger Button */}
                <button
                  type="button"
                  onClick={openCart}
                  className="relative p-2 text-gray-800 hover:text-blue-600 transition rounded-full hover:bg-gray-100 flex items-center cursor-pointer"
                  aria-label="Open shopping cart"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0f1c3f] text-white text-[11px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                      {totalQuantity}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-slate-50 py-3 px-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foot alignment socks, pain relief, colors..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f1c3f] focus:border-transparent shadow-xs"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f1c3f] hover:bg-[#1a2d5e] text-white text-sm font-semibold rounded-full transition shadow-xs cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
