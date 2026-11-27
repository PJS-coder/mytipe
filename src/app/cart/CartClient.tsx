"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, ArrowLeft, Lock, Loader2, BadgePercent } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartMilestoneBar from "@/components/cart/CartMilestoneBar";
import { formatPrice, getOptimizedImageUrl } from "@/lib/utils";


export default function CartClient() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tierDiscount,
    finalSubtotal,
    totalSavings,
    totalQuantity,
  } = useCart();

  const { isAuthenticated, openAuthModal } = useAuth();
  const [orderNote, setOrderNote] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleProceedCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal({
        prompt: "Please sign in with your phone to proceed to checkout",
        onSuccess: () => {
          router.push("/checkout");
        },
      });
      return;
    }
    setIsCheckingOut(true);
    router.push("/checkout");
  };


  if (items.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Your Cart is Empty</h1>
            <p className="text-sm text-gray-500 mt-2">
              Start your journey to pain-free feet and healthy toe alignment today.
            </p>
          </div>
          <Link
            href="/collections/all-socks"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg"
          >
            Browse Alignment Socks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <Link
            href="/collections/all-socks"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Cart Milestone Progress Bar */}
        <CartMilestoneBar subtotal={subtotal} className="rounded-2xl border border-gray-200 mb-8 shadow-xs" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start">
          {/* Cart Table List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {items.map((item) => {
                const itemPrice = parseFloat(item.price.amount);
                const comparePrice = item.compareAtPrice ? parseFloat(item.compareAtPrice.amount) : null;

                return (
                  <div key={item.id} className="py-6 flex gap-4 sm:gap-6 items-center">
                    {/* Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={getOptimizedImageUrl(item.image.url, 224)}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="112px"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.handle}`}
                          className="font-bold text-gray-900 hover:text-blue-600 text-sm sm:text-base transition line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500">
                        {item.selectedOptions?.map((o) => (
                          <span key={o.name} className="bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                            {o.value}
                          </span>
                        ))}
                        {item.discountBadge && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                            {item.discountBadge}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-xl bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-xs font-bold text-gray-800 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-base sm:text-lg font-black text-gray-950">
                            {formatPrice(itemPrice * item.quantity, item.price.currencyCode)}
                          </div>
                          {comparePrice && comparePrice > itemPrice && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(comparePrice * item.quantity, item.price.currencyCode)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Note */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Order Delivery Instructions / Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Special delivery notes or gate landmark..."
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f1c3f]"
              />
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-950 uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalQuantity} items)</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {tierDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 text-xs">
                  <span className="flex items-center gap-1.5">
                    <BadgePercent className="w-4 h-4 text-emerald-600" />
                    <span>Milestone Discount ({tierDiscount === 200 ? "₹200 OFF" : "₹100 OFF"})</span>
                  </span>
                  <span>-{formatPrice(tierDiscount)}</span>
                </div>
              )}

              {totalSavings > 0 && (
                <div className="flex justify-between text-gray-600 text-xs font-semibold">
                  <span>Special Discount Savings</span>
                  <span className="text-emerald-700">-{formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Standard Shipping</span>
                <span className="text-emerald-700 font-bold uppercase text-xs">
                  {subtotal >= 399 ? "FREE" : "₹50 (FREE at ₹399)"}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-2">
                    {tierDiscount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(subtotal + (subtotal >= 399 ? 0 : 50))}
                      </span>
                    )}
                    <span className="text-2xl font-black text-gray-950">
                      {formatPrice(finalSubtotal + (subtotal >= 399 ? 0 : 50))}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">Including all taxes</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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

            <div className="space-y-2 pt-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Dispatches from Noida warehouse in 24 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
