"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "featured" | "best-selling" | "price-asc" | "price-desc" | "rating";

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">
        Sort By:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0f1c3f] cursor-pointer shadow-xs"
      >
        <option value="featured">Featured</option>
        <option value="best-selling">Best Selling</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}
