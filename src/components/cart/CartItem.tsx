"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartLineItem } from "@/types/store";
import { formatPrice, getOptimizedImageUrl } from "@/lib/utils";

interface CartItemProps {
  item: CartLineItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCloseCart?: () => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onCloseCart,
}: CartItemProps) {
  const currentPrice = parseFloat(item.price.amount);
  const comparePrice = item.compareAtPrice ? parseFloat(item.compareAtPrice.amount) : null;
  const itemTotal = currentPrice * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group">
      {/* Product Image */}
      <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
        <Image
          src={getOptimizedImageUrl(item.image.url, 160)}
          alt={item.image.altText || item.title}
          fill
          unoptimized
          sizes="80px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${item.handle}`}
              onClick={onCloseCart}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 transition"
            >
              {item.title}
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-rose-600 p-1 -mr-1 transition"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Options / Bundle Badge */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-gray-500">
            {item.selectedOptions?.map((opt) => (
              <span key={opt.name} className="bg-slate-100 px-2 py-0.5 rounded-md">
                {opt.value}
              </span>
            ))}
            {item.discountBadge && (
              <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md text-[10px] uppercase">
                {item.discountBadge}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg bg-slate-50">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-slate-200 rounded-l-lg transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-gray-800 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-slate-200 rounded-r-lg transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">
              {formatPrice(itemTotal, item.price.currencyCode)}
            </div>
            {comparePrice && comparePrice > currentPrice && (
              <div className="text-xs text-gray-400 line-through">
                {formatPrice(comparePrice * item.quantity, item.price.currencyCode)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
