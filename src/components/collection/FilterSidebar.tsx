"use client";

import React from "react";
import Link from "next/link";
import { X, Filter, RotateCcw } from "lucide-react";

interface FilterState {
  colors: string[];
  maxPrice: number;
  category: string;
  concern: string;
}

const CATEGORY_ITEMS = [
  { label: "All Categories", handle: "all-socks", href: "/collections/all-socks" },
  { label: "Combos", handle: "combos", href: "/collections/combos" },
  { label: "Pair of 1", handle: "pair-1", href: "/products/foot-alignment-socks?pack=1" },
  { label: "Pair of 2", handle: "pair-2", href: "/products/foot-alignment-socks?pack=2" },
  { label: "Pair of 3", handle: "pair-3", href: "/products/foot-alignment-socks?pack=3" },
  { label: "Pair of 6", handle: "pair-6", href: "/products/foot-alignment-socks?pack=6" },
  { label: "Gym Socks", handle: "gym-socks", href: "/collections/gym-socks" },
  { label: "Pain Relief Socks", handle: "foot-alignment-socks", href: "/products/foot-alignment-socks" },
  { label: "Diabetic Socks", handle: "diabetic-socks", href: "/collections/diabetic-socks" },
  { label: "Office Socks", handle: "office-socks", href: "/collections/office-socks" },
  { label: "Designer Socks", handle: "designer-socks", href: "/collections/designer-socks" },
];

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableColors: string[];
  onReset: () => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
  currentHandle?: string;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableColors,
  onReset,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
  currentHandle = "",
}: FilterSidebarProps) {
  const toggleColor = (color: string) => {
    const updated = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: updated });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: parseInt(e.target.value, 10) });
  };

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-700" />
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Filters</h3>
        </div>
        {(filters.colors.length > 0 || filters.category || filters.concern || filters.maxPrice < 2500) && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category / Types Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
            Category
          </label>
          <span className="text-[10px] text-gray-400 font-medium">
            {CATEGORY_ITEMS.length} types
          </span>
        </div>
        <div className="space-y-0.5">
          {CATEGORY_ITEMS.map((item) => {
            const isActive =
              currentHandle === item.handle ||
              (item.handle === "all-socks" &&
                (!currentHandle || currentHandle === "all-socks" || currentHandle === "frontpage")) ||
              filters.category === item.handle;

            return (
              <Link
                key={item.handle}
                href={item.href}
                onClick={onCloseMobileDrawer}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex items-center justify-between block ${isActive
                  ? "bg-[#0f1c3f] text-white font-bold"
                  : "text-gray-700 hover:bg-slate-100"
                  }`}
              >
                <span className="truncate pr-1">{item.label}</span>
                {isActive && <span className="shrink-0">&bull;</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
          Color
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableColors.map((color) => {
            const isSelected = filters.colors.includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition cursor-pointer ${isSelected
                  ? "bg-[#0f1c3f] text-white border-[#0f1c3f] font-semibold shadow-2xs"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-gray-800 uppercase tracking-wider">Max Price</label>
          <span className="font-bold text-blue-700">₹{filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="160"
          max="2500"
          step="50"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-[#0f1c3f] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>₹160</span>
          <span>₹2,500</span>
        </div>
      </div>
    </div>
  );

  // Desktop Sidebar
  return (
    <>
      <div className="hidden lg:block w-64 shrink-0 pr-6 sticky top-20 xl:top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain pb-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobileDrawer}
          />
          <div className="relative w-full max-w-xs bg-white text-gray-900 shadow-2xl z-10 flex flex-col h-full p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-4 border-b">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">{content}</div>
            <div className="pt-4 border-t">
              <button
                onClick={onCloseMobileDrawer}
                className="w-full py-3 bg-[#0f1c3f] text-white font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
