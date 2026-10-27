"use client";

import React from "react";
import { ProductBundleTier } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

interface BundleSelectorProps {
  bundles: ProductBundleTier[];
  selectedBundleId: string;
  onSelectBundle: (bundle: ProductBundleTier) => void;
}

export default function BundleSelector({
  bundles,
  selectedBundleId,
  onSelectBundle,
}: BundleSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-900">
          SELECT QUANTITY &amp; SAVE:
        </label>
        <span className="text-xs font-semibold text-[#e11d48] bg-rose-50 px-2 py-0.5 rounded-md">
          ⚡ Free Shipping On All Bundles
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {bundles.map((bundle) => {
          const isSelected = selectedBundleId === bundle.id;

          return (
            <div
              key={bundle.id}
              onClick={() => onSelectBundle(bundle)}
              className={`relative p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? "border-[#0f1c3f] bg-blue-50/40 shadow-xs ring-1 ring-[#0f1c3f]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Radio Indicator & Details */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[#0f1c3f] bg-[#0f1c3f] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-gray-900">
                      {bundle.title}
                    </span>
                    {bundle.badge && (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                          bundle.isPopular
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-[#ffe4e6] text-[#e11d48]"
                        }`}
                      >
                        {bundle.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatPrice(bundle.pricePerPair)} per pair &bull;{" "}
                    <span className="text-emerald-700 font-semibold">
                      Save {formatPrice(bundle.savings)} ({bundle.discountPercentage}%)
                    </span>
                  </p>
                </div>
              </div>

              {/* Total Price Column */}
              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-gray-950">
                  {formatPrice(bundle.totalPrice)}
                </div>
                <div className="text-xs text-gray-400 line-through">
                  {formatPrice(bundle.compareAtPrice)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
