"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Lock, Check } from "lucide-react";
import { Product, ProductVariant, ProductBundleTier } from "@/types/store";
import { formatPrice, getOptimizedImageUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

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
  const { addItem, openCart } = useCart();
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
    openCart();
  };

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 sm:px-6 sm:py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
        scrolled ? "translate-y-0" : "max-md:translate-y-0 md:translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Product Thumbnail & Price */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs">
            <Image
              src={getOptimizedImageUrl(selectedVariant.image?.url || product.featuredImage.url, 120)}
              alt={product.title}
              fill
              sizes="48px"
              className="object-cover object-center"
              unoptimized
            />
          </div>
          <div className="min-w-0 pr-1">
            <p className="text-[11px] sm:text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs">
              {product.title}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-gray-950">
                {formatPrice(currentPrice, selectedVariant.price.currencyCode)}
              </span>
              {comparePrice && comparePrice > currentPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {formatPrice(comparePrice, selectedVariant.price.currencyCode)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: ADD TO CART and BUY NOW */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant.availableForSale}
            className="px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                <span className="text-emerald-700 font-black">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy Now button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!selectedVariant.availableForSale}
            className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-[#0f1c3f] hover:bg-[#1a2e66] active:scale-95 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
