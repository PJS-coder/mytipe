"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, ArrowRight, ShieldCheck, Lock, Loader2, Coins, Sparkles, BadgePercent } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartItem from "./CartItem";
import CartMilestoneBar from "./CartMilestoneBar";
import { formatPrice } from "@/lib/utils";


export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalQuantity,
    subtotal,
    tierDiscount,
    isCheckoutUnlocked,
    totalSavings,
  } = useCart();

  const { user, isAuthenticated, openAuthModal, openSpinWheel } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [applyCoins, setApplyCoins] = useState(false);

  // Maximum redeemable coins (e.g. up to user coins or 50% of subtotal)
  const maxCoinsToUse = user ? Math.min(user.coins, Math.floor(Math.max(0, subtotal - tierDiscount) * 0.5)) : 0;
  const coinDiscount = applyCoins ? maxCoinsToUse : 0;
  
  // Also check active winning coupon from Fortune Wheel
  const couponDiscount = user?.activeCoupon
    ? user.activeCoupon.discountType === "percentage"
      ? Math.round((subtotal * user.activeCoupon.discountValue) / 100)
      : user.activeCoupon.discountValue
    : 0;

  const finalTotal = Math.max(0, subtotal - tierDiscount - coinDiscount - couponDiscount);

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleProceedCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal({
        prompt: "Please sign in with your phone to proceed to checkout",
        onSuccess: () => {
          closeCart();
          router.push("/checkout");
        },
      });
      return;
    }
    setIsCheckingOut(true);
    closeCart();
    router.push("/checkout");
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-white text-gray-900 shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Drawer Header (Exact match to screenshot) */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="font-bold text-gray-950 text-xl sm:text-2xl tracking-tight">
            Your cart ({totalQuantity})
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-950 transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Milestone Progress Bar Section */}
        <CartMilestoneBar subtotal={subtotal} />

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Relieve foot pain and realign your toes. Browse our best sellers today!
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-[#0f1c3f] text-white text-sm font-semibold rounded-full hover:bg-[#1a2e66] transition shadow-md cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onCloseCart={closeCart}
              />
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-slate-50 space-y-3">
            
            {/* Active Wheel Coupon */}
            {user?.activeCoupon && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs">
                    %
                  </div>
                  <div>
                    <span className="font-bold text-red-900 block">
                      {user.activeCoupon.label} Applied!
                    </span>
                    <span className="text-[10px] text-red-700 font-mono">
                      Code: {user.activeCoupon.code}
                    </span>
                  </div>
                </div>
                <span className="font-black text-red-700">
                  -{formatPrice(couponDiscount)}
                </span>
              </div>
            )}

            {/* Mytipe Coin Wallet Integration */}
            {isAuthenticated && user && user.coins > 0 ? (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 font-bold text-amber-950 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applyCoins}
                      onChange={(e) => setApplyCoins(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                    />
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Redeem {maxCoinsToUse} Mytipe Coins</span>
                  </label>
                  <span className="font-black text-amber-900">-₹{maxCoinsToUse}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-700 pl-6">
                  <span>Your Balance: {user.coins} Coins</span>
                  <button
                    onClick={() => {
                      closeCart();
                      openSpinWheel();
                    }}
                    className="font-bold underline hover:text-amber-950 cursor-pointer"
                  >
                    Spin for more rewards &rarr;
                  </button>
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="p-2.5 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Sign in with Mobile for coin discounts</span>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    openAuthModal();
                  }}
                  className="font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  Sign In &rarr;
                </button>
              </div>
            ) : null}

            {/* Milestone Order Discount Notification */}
            {tierDiscount > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    <BadgePercent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Milestone Discount Unlocked!
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {tierDiscount === 200 ? "₹200 OFF auto-applied 🤑" : "₹100 OFF auto-applied 🤩"}
                    </span>
                  </div>
                </div>
                <span className="font-black text-emerald-800 text-sm">
                  -₹{tierDiscount}
                </span>
              </div>
            )}

            {totalSavings > 0 && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-between border border-emerald-200">
                <span>Total Instant Savings</span>
                <span className="font-bold">{formatPrice(totalSavings)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
              <span>Subtotal</span>
              <div className="text-right">
                {tierDiscount > 0 || (applyCoins && coinDiscount > 0) || couponDiscount > 0 ? (
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs text-gray-400 line-through">{formatPrice(subtotal)}</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(finalTotal)}</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              {isCheckoutUnlocked ? (
                <span className="text-emerald-700 font-semibold">✓ FREE Express Delivery & Checkout Unlocked</span>
              ) : (
                <span>Taxes & shipping calculated at checkout. Free COD available.</span>
              )}
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleProceedCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 bg-[#0f1c3f] hover:bg-[#172b5c] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg text-sm tracking-wide cursor-pointer disabled:opacity-75"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Redirecting to Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PROCEED TO SECURE CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <Link
                href="/cart"
                onClick={closeCart}
                className="block text-center text-xs font-semibold text-gray-600 hover:text-gray-900 py-1"
              >
                View Full Cart Details
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Safe Checkout
              </span>
              <span>&bull;</span>
              <span>Fast 24-Hr Dispatch</span>
              <span>&bull;</span>
              <span>Easy 30-Day Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
