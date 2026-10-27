"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Product, ProductVariant, ProductBundleTier } from "@/types/store";
import { formatPrice } from "@/lib/utils";
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
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 500px
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const currentPrice = selectedBundle
    ? selectedBundle.totalPrice
    : parseFloat(selectedVariant.price.amount);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-2xl animate-in slide-in-from-bottom duration-200 sm:hidden">
      <div className="flex items-center justify-between gap-3">
        {/* Product Thumbnail & Price */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <Image
              src={selectedVariant.image?.url || product.featuredImage.url}
              alt={product.title}
              fill
              sizes="44px"
              className="object-cover object-center"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{product.title}</p>
            <p className="text-xs font-extrabold text-[#e11d48]">
              {formatPrice(currentPrice, selectedVariant.price.currencyCode)}
            </p>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={() => addItem(product, selectedVariant, 1, selectedBundle)}
          className="px-5 py-2.5 bg-[#0f1c3f] active:bg-[#1a2d5e] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
}
