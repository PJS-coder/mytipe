"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Lock, Check } from "lucide-react";
import { Product, ProductVariant, ProductBundleTier } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface StickyAddToCartProps {
  product: Product;
  selectedVariant: ProductVariant;
  selectedBundle?: ProductBundleTier;
}

export default function StickyAddToCart({
  product,
  selectedVariant,
  selectedBundle,
}: StickyAddToCartProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // On desktop, slide up after scrolling 350px
      if (window.scrollY > 350) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPrice = selectedBundle
    ? selectedBundle.totalPrice
    : parseFloat(selectedVariant.price.amount);

  const comparePrice = selectedBundle
    ? selectedBundle.compareAtPrice
    : selectedVariant.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : null;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, 1, selectedBundle);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, 1, selectedBundle);
    if (!isAuthenticated) {
      openAuthModal({
        prompt: "Please sign in with your phone to complete your purchase",
        onSuccess: () => {
          router.push("/checkout");
        },
      });
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 py-2 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] md:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Price Only */}
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className="text-sm sm:text-base font-black text-[#0f1c3f]">
            {formatPrice(currentPrice, selectedVariant.price.currencyCode)}
          </span>
          {comparePrice && comparePrice > currentPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatPrice(comparePrice, selectedVariant.price.currencyCode)}
            </span>
          )}
        </div>

        {/* Action Buttons: ADD TO CART and BUY NOW (Small & Compact) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant.availableForSale}
            className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-gray-900 border border-gray-300 font-bold text-[11px] uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700 font-black">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-gray-700" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy Now button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!selectedVariant.availableForSale}
            className="px-3 sm:px-4 py-1.5 bg-[#0f1c3f] hover:bg-[#1a2e66] active:scale-95 text-white font-bold text-[11px] uppercase tracking-wider rounded-lg transition flex items-center gap-1 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Lock className="w-3 h-3 text-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
