"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Truck,
  Coins,
  Gift,
  Sparkles,
  LogOut,
  Clock,
  Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountClient() {
  const {
    user,
    isAuthenticated,
    logout,
    openAuthModal,
    loginWithPhone,
    openSpinWheel,
    hasClaimedWelcomeSpin,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<"account" | "track">("account");
  const [orderId, setOrderId] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [trackingResult, setTrackingResult] = useState<boolean | null>(null);

  // Quick Mobile Sign In form state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginName, setLoginName] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      setTrackingResult(true);
    }
  };

  const handleDirectMobileLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length >= 10) {
      loginWithPhone(cleanPhone, loginName);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            {isAuthenticated && user ? `Welcome, ${user.name}!` : "Customer Account & Tracking"}
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {isAuthenticated
              ? "Manage your Mytipe coin wallet, welcome rewards, and track active shipments."
              : "Track your Mytipe foot care shipments or sign in with your mobile number to access your account."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl">
            <button
              onClick={() => setActiveTab("account")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "account"
                  ? "bg-white text-gray-950 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {isAuthenticated ? "My Account & Coins" : "Mobile Sign In"}
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === "track"
                  ? "bg-white text-gray-950 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Track Order
            </button>
          </div>
        </div>

        {/* ================= LOGGED IN USER DASHBOARD ================= */}
        {activeTab === "account" && isAuthenticated && user && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
            
            {/* Coin & Reward Banner */}
            <div className="bg-gradient-to-br from-[#0f1c3f] via-[#1a2e66] to-[#0a1430] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/50 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mytipe Member Wallet</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {user.coins} Mytipe Coins
                  </h2>
                  <p className="text-xs text-blue-200">
                    {hasClaimedWelcomeSpin ? "Fortune Wheel Reward Claimed" : "Fortune Wheel Available!"} &bull; 1 Coin = ₹1 Discount Value
                  </p>
                </div>

                {!hasClaimedWelcomeSpin ? (
                  <button
                    type="button"
                    onClick={openSpinWheel}
                    className="px-6 py-3.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-white" />
                    <span>Spin Fortune Wheel</span>
                  </button>
                ) : (
                  <Link
                    href="/collections/all-socks"
                    className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2"
                  >
                    <span>Use Coins &amp; Shop</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Profile Info & Actions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0f1c3f] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-base">{user.name}</h3>
                    <p className="text-xs text-gray-500">+91 {user.phone}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Active Coupon Banner if won */}
              {user.activeCoupon && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-red-900">
                      Active Fortune Wheel Reward: {user.activeCoupon.label}
                    </div>
                    <div className="text-[11px] text-red-700 font-mono mt-0.5">
                      Coupon Code: {user.activeCoupon.code}
                    </div>
                  </div>
                  <Link
                    href="/collections/all-socks"
                    className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              )}

              {/* Quick Perks grid */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/mytipe-club"
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-gray-100 transition group"
                >
                  <Sparkles className="w-5 h-5 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-gray-900">Mytipe Club</div>
                  <div className="text-[11px] text-gray-500">Ways to earn &amp; redeem</div>
                </Link>

                <Link
                  href="/collections/all-socks"
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-gray-100 transition group"
                >
                  <Package className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-xs text-gray-900">Shop Catalog</div>
                  <div className="text-[11px] text-gray-500">Apply coins at checkout</div>
                </Link>
              </div>

              {/* Coin Transactions History */}
              <div className="pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Coin Activity</span>
                </h4>

                <div className="space-y-2">
                  {user.transactions && user.transactions.length > 0 ? (
                    user.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs border border-gray-100"
                      >
                        <div className="flex items-center gap-2.5">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <div>
                            <div className="font-semibold text-gray-900">{tx.description}</div>
                            <div className="text-[10px] text-gray-400">
                              {new Date(tx.timestamp).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-black ${
                            tx.amount > 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-gray-400">
                      No coins yet. Spin your first-login welcome wheel to claim coins!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LOGGED OUT: MOBILE PHONE SIGN IN ================= */}
        {activeTab === "account" && !isAuthenticated && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200 max-w-[340px] sm:max-w-sm mx-auto space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 text-xl tracking-tight">
                Mobile Sign In
              </h3>
              <p className="text-xs text-gray-500">
                Access your orders, coins &amp; fortune wheel rewards
              </p>
            </div>

            <form onSubmit={handleDirectMobileLogin} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="e.g. Aman Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1c3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-xs font-bold text-gray-500 border-r border-gray-300 pr-2">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="98765 43210"
                    required
                    className="w-full pl-14 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f1c3f]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginPhone.length < 10}
                className="w-full py-3.5 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                <span>Sign In with Phone</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center border-t border-gray-100">
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Or Open OTP Login Modal &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ================= TRACK ORDER TAB ================= */}
        {activeTab === "track" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Track Your Shipment</h3>
                <p className="text-xs text-gray-500">Enter your Order ID (e.g. #MY-8924) and Mobile Number</p>
              </div>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Order Number / AWB
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. MY-10492"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f1c3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Phone Number / Email
                </label>
                <input
                  type="text"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f1c3f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {trackingResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Order {orderId} Dispatched</span>
                </div>
                <p>Status: In Transit via BlueDart Express &bull; Estimated Delivery in 24-48 Hours</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
