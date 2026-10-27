"use client";

import React from "react";
import { Product } from "@/types/store";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-base">No products found matching your selection.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-4 sm:gap-6 lg:gap-8`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
