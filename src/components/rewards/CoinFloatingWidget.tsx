"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Gift } from "lucide-react";

export default function CoinFloatingWidget() {
  const { openSpinWheel } = useAuth();

  return (
    <div className="fixed left-0 sm:left-2 top-1/2 -translate-y-1/2 z-40">
      <button
        onClick={openSpinWheel}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-slate-50 text-gray-900 rounded-r-2xl sm:rounded-full shadow-2xl border border-gray-200/80 hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
        aria-label="Spin Wheel Gift"
        title="Spin to Win Rewards!"
      >
        {/* Gift Box Icon */}
        <div className="relative flex items-center justify-center">
          <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-gray-950 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Subtle glowing ring */}
          <span className="absolute -inset-1.5 rounded-full bg-blue-500/15 animate-ping pointer-events-none" />
        </div>

        {/* Small Blue Indicator Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2b76a6] border-2 border-white shadow-xs"></span>
        </span>
      </button>
    </div>
  );
}

