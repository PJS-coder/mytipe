"use client";

import React, { useState, useEffect } from "react";
import { Heart, Truck } from "lucide-react";

export default function AnnouncementBar() {
  const items = [
    { text: "Instant Freshness For Every Step", icon: null },
    {
      text: "Comfort You Can Feel All Day",
      icon: <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300 shrink-0" />,
    },
    {
      text: "Free Shipping Above ₹449",
      icon: <Truck className="w-3.5 h-3.5 text-sky-200 shrink-0" />,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Single topic goes (fades out in place)
      setIsVisible(false);

      // 2. Next single topic comes (fades in in place)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsVisible(true);
      }, 400);
    }, 3200);

    return () => clearInterval(timer);
  }, [items.length]);

  const currentItem = items[currentIndex];

  return (
    <div className="bg-[#2b76a6] text-white text-xs sm:text-[13px] font-bold tracking-wider py-2 sm:py-2.5 overflow-hidden select-none shadow-xs relative flex items-center justify-center">
      {/* Mobile: Single topic comes and goes in place. Zero motion, zero scrolling, zero rotation */}
      <div className="lg:hidden w-full h-5 flex items-center justify-center px-4 overflow-hidden">
        <div
          className={`flex items-center justify-center gap-2 text-center transition-opacity duration-400 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentItem.icon}
          <span className="text-white text-xs font-extrabold uppercase tracking-wide truncate">
            {currentItem.text}
          </span>
        </div>
      </div>

      {/* Desktop: Continuous ticker marquee (only on screens >= 1024px) */}
      <div className="hidden lg:flex w-max animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-8 xl:gap-14 px-4 xl:px-8">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white font-extrabold uppercase drop-shadow-xs">
                {item.icon}
                <span>{item.text}</span>
                <span className="text-sky-200/70 font-normal ml-8 xl:ml-12">&bull;</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
