"use client";

import React from "react";
import { Truck, BadgePercent } from "lucide-react";
import { calculateCartMilestones } from "@/lib/constants/cart";

interface CartMilestoneBarProps {
  subtotal: number;
  className?: string;
}

export default function CartMilestoneBar({ subtotal, className = "" }: CartMilestoneBarProps) {
  const {
    isCheckoutUnlocked,
    isDiscount100Unlocked,
    isDiscount200Unlocked,
    fillPercentage,
    message,
  } = calculateCartMilestones(subtotal);

  return (
    <div className={`bg-white px-3 sm:px-5 pt-3 pb-6 border-b border-gray-100 select-none ${className}`}>
      {/* Top Dynamic Message */}
      <p className="text-center text-[14px] sm:text-[15px] font-medium text-gray-900 mb-6 px-2">
        {message}
      </p>

      {/* Progress Track & Nodes Container */}
      <div className="relative mx-6 sm:mx-8">
        {/* Grey Background Track */}
        <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
          {/* Active Black Fill Track */}
          <div
            className="h-full bg-[#222222] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>

        {/* Milestone 1: Unlock Checkout (at ~33.33%) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: "33.33%" }}
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isCheckoutUnlocked
                ? "bg-[#222222] text-white shadow-md ring-2 ring-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="absolute top-full mt-2.5 text-[11px] sm:text-xs font-semibold text-gray-800 whitespace-nowrap">
            Unlock Checkout
          </span>
        </div>

        {/* Milestone 2: ₹100 OFF (at ~66.66%) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: "66.66%" }}
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDiscount100Unlocked
                ? "bg-[#222222] text-white shadow-md ring-2 ring-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <BadgePercent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="absolute top-full mt-2.5 text-[11px] sm:text-xs font-semibold text-gray-800 whitespace-nowrap flex items-center gap-1">
            ₹100 OFF <span className="text-sm">🤩</span>
          </span>
        </div>

        {/* Milestone 3: ₹200 OFF (at 100%) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ left: "100%" }}
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDiscount200Unlocked
                ? "bg-[#222222] text-white shadow-md ring-2 ring-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <BadgePercent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="absolute top-full mt-2.5 text-[11px] sm:text-xs font-semibold text-gray-800 whitespace-nowrap flex items-center gap-1 -translate-x-1 sm:translate-x-0">
            ₹200 OFF <span className="text-sm">🤑</span>
          </span>
        </div>
      </div>

      {/* Spacer for bottom labels height */}
      <div className="h-6" />
    </div>
  );
}
