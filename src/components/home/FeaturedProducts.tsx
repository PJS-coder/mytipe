"use client";

import React, { useState } from "react";
import { Product } from "@/types/store";
import ProductCard from "@/components/product/ProductCard";

interface FeaturedProductsProps {
  bestSellers: Product[];
  newArrivals: Product[];
}

export default function FeaturedProducts({
  bestSellers,
  newArrivals,
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<"best" | "new">("best");
  const displayProducts = activeTab === "best" ? bestSellers : newArrivals;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-950 uppercase">
            SHOP MYTIPE SOCKS
          </h2>

          {/* Toggle Tabs */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={() => setActiveTab("best")}
              className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest pb-1 transition-all border-b-2 ${
                activeTab === "best"
                  ? "text-gray-900 border-black"
                  : "text-gray-400 border-transparent hover:text-gray-700"
              }`}
            >
              BEST SELLERS
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest pb-1 transition-all border-b-2 ${
                activeTab === "new"
                  ? "text-gray-900 border-black"
                  : "text-gray-400 border-transparent hover:text-gray-700"
              }`}
            >
              NEW ARRIVALS
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
