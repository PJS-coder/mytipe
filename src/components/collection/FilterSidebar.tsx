"use client";

import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";

interface FilterState {
  colors: string[];
  maxPrice: number;
  category: string;
  concern: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableColors: string[];
  onReset: () => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableColors,
  onReset,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
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

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? "" : category,
    });
  };

  const handleConcernChange = (concern: string) => {
    onFilterChange({
      ...filters,
      concern: filters.concern === concern ? "" : concern,
    });
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
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
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          {[
            { label: "All Categories", value: "" },
            { label: "Rakhi Gift For Brothers", value: "rakhi-gift-for-brothers" },
            { label: "Mytipe Foot Care Kits", value: "mytipe-foot-care-kits" },
            { label: "Gym Socks", value: "gym-socks" },
            { label: "Pain Relief Socks", value: "pain-relief-socks" },
            { label: "Diabetic Socks", value: "diabetic-socks" },
            { label: "Office Socks", value: "office-socks" },
            { label: "Designer Socks", value: "designer-socks" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handleCategoryChange(item.value)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg transition flex items-center justify-between cursor-pointer ${
                filters.category === item.value
                  ? "bg-[#0f1c3f] text-white font-bold"
                  : "text-gray-700 hover:bg-slate-100"
              }`}
            >
              <span>{item.label}</span>
              {filters.category === item.value && <span>&bull;</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
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
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  isSelected
                    ? "bg-[#0f1c3f] text-white border-[#0f1c3f] font-semibold"
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
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-gray-800 uppercase tracking-wider">Max Price</label>
          <span className="font-bold text-blue-700">₹{filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="600"
          max="2500"
          step="50"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-[#0f1c3f] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>₹600</span>
          <span>₹2,500</span>
        </div>
      </div>
    </div>
  );

  // Desktop Sidebar
  return (
    <>
      <div className="hidden lg:block w-64 shrink-0 pr-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
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
