"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types/store";
import { formatPrice, calculateDiscount, getOptimizedImageUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  priority?: boolean;
}

export default function ProductCard({
  product,
  showQuickAdd = true,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const comparePrice = product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;

  const discount = comparePrice ? calculateDiscount(price, comparePrice) : null;

  const defaultVariant = product.variants[0] || {
    id: `${product.id}-default`,
    title: "Default",
    availableForSale: true,
    selectedOptions: [],
    price: product.priceRange.minVariantPrice,
  };

  const mainImage = product.featuredImage;
  const hoverImage = product.images.length > 1 ? product.images[1] : product.featuredImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, defaultVariant, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100/80 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Discount Badge */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 pointer-events-none">
        {discount && discount > 0 ? (
          <span className="bg-emerald-50/95 text-emerald-800 border border-emerald-300/80 text-[9px] sm:text-[10px] md:text-[11px] font-extrabold tracking-wide sm:tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase shadow-xs backdrop-blur-xs inline-flex items-center">
            <span className="hidden sm:inline">Save up to {discount}%</span>
            <span className="sm:hidden">{discount}% OFF</span>
          </span>
        ) : (
          <span className="bg-white/95 text-slate-900 border border-slate-200/90 text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-wide sm:tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase shadow-xs backdrop-blur-xs inline-flex items-center">
            Best Seller
          </span>
        )}
      </div>

      {/* Image Container with hover transition */}
      <Link
        href={`/products/${product.handle}`}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden block"
      >
        <Image
          src={getOptimizedImageUrl(isHovered && hoverImage ? hoverImage.url : mainImage.url, 480)}
          alt={mainImage.altText || product.title}
          fill
          unoptimized
          priority={priority}
          loading="eager"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Quick Action Overlay */}
        {showQuickAdd && (
          <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="flex-1 py-2.5 bg-white/95 hover:bg-[#0f1c3f] text-[#0f1c3f] hover:text-white font-bold text-xs tracking-wider uppercase rounded-xl backdrop-blur-xs transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdding ? "Added!" : "Quick Add"}</span>
            </button>
            <span className="p-2.5 bg-white/95 text-gray-700 hover:text-black rounded-xl backdrop-blur-xs shadow-lg flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between text-center">
        <div>
          <Link
            href={`/products/${product.handle}`}
            className="block text-sm sm:text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1"
          >
            {product.title}
          </Link>

          {/* Pricing */}
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-black text-[#0f1c3f]">
              From {formatPrice(price, product.priceRange.minVariantPrice.currencyCode)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {formatPrice(comparePrice, product.priceRange.minVariantPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>

        {/* Star Ratings & Count */}
        <div className="mt-2.5 flex items-center justify-center gap-1 text-xs text-gray-600">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-current text-amber-400"
              />
            ))}
          </div>
          <span className="font-semibold text-gray-700 text-xs">
            ({product.rating?.count ? product.rating.count.toLocaleString() : "2,700+"})
          </span>
        </div>
      </div>
    </div>
  );
}
