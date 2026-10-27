"use client";

import React from "react";
import { Heart, Truck } from "lucide-react";

export default function AnnouncementBar() {
  const marqueeItems = [
    { text: "Instant Freshness For Every Step", icon: null },
    { text: "Comfort You Can Feel All Day", icon: <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300 shrink-0" /> },
    { text: "Free Shipping Above ₹449", icon: <Truck className="w-3.5 h-3.5 text-sky-200 shrink-0" /> },
  ];

  return (
    <div className="bg-[#2b76a6] text-white text-xs sm:text-[13px] font-bold tracking-wider py-2 sm:py-2.5 overflow-hidden select-none shadow-xs relative flex items-center">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {/* Repeat sequence for smooth infinite loop */}
        {[...Array(4)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-8 sm:gap-14 px-4 sm:px-8">
            {marqueeItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white font-extrabold uppercase drop-shadow-xs">
                {item.icon}
                <span>{item.text}</span>
                <span className="text-sky-200/70 font-normal ml-8 sm:ml-12">&bull;</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
