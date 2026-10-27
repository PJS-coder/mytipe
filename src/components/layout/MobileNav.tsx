"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ChevronRight,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  Coins,
  Gift,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isAuthenticated, logout, openAuthModal, openSpinWheel, hasClaimedWelcomeSpin } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-white text-gray-900 shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-left duration-300">
        <div className="p-4 border-b flex items-center justify-between bg-slate-50">
          <Link href="/" onClick={onClose} className="flex items-center">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Mytipe Logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* User Account / Login Header Card */}
        <div className="p-4 bg-gradient-to-br from-[#0f1c3f] to-[#1e3a8a] text-white">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-gray-950 font-black text-sm flex items-center justify-center uppercase shadow-md">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-blue-200 truncate">{user.email}</p>
                </div>
              </div>

              {/* Coin Status and Spin Trigger */}
              <div className="flex items-center justify-between p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{user.coins} Coins</span>
                </div>
                {!hasClaimedWelcomeSpin ? (
                  <button
                    onClick={() => {
                      onClose();
                      openSpinWheel();
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 text-[11px] font-black uppercase rounded-lg shadow-xs hover:scale-105 active:scale-95 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Claim Gift</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-blue-200 font-bold uppercase">Member</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 text-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <Gift className="w-3 h-3" />
                <span>Spin &amp; Win Welcome Gift</span>
              </div>
              <p className="text-xs text-blue-100">
                Sign in with your mobile number to unlock rewards &amp; discounts
              </p>
              <button
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="w-full py-2.5 bg-white text-[#0f1c3f] hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign in with Mobile</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            {!hasClaimedWelcomeSpin && (
              <button
                onClick={() => {
                  onClose();
                  openSpinWheel();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <span>Spin the Wheel Gift</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
            )}

            <Link
              href="/mytipe-club"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl font-bold text-gray-800 hover:bg-slate-100 transition"
            >
              <span>Our super hero</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/collections/all-socks"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl font-bold text-gray-800 hover:bg-slate-100 transition"
            >
              <span>Shop All</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          {/* Shop Categories */}
          <div className="pt-2 border-t">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Shop Categories
            </h3>
            <div className="space-y-1">
              <Link
                href="/collections/rakhi-gift-for-brothers"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Rakhi Gift For Brothers</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/collections/mytipe-foot-care-kits"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Mytipe Foot Care Kits</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/collections/gym-socks"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Gym Socks</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/products/pain-relief-socks"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Pain Relief Socks</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/collections/diabetic-socks"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Diabetic Socks</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/collections/office-socks"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Office Socks</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <Link
                href="/collections/designer-socks"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition"
              >
                <span>Designer Socks</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Quick Perks */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Free Delivery Above ₹449</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Over 300,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-Day Pain Relief Guarantee</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-slate-50 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-600" />
            <span>+91-7310585356</span>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="font-semibold text-[#0f1c3f] hover:underline cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
