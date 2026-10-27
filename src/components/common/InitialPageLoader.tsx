"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function InitialPageLoader() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleReady = () => {
      setTimeout(() => {
        setFading(true);
        setTimeout(() => setHidden(true), 400);
      }, 350);
    };

    if (document.readyState === "complete") {
      handleReady();
    } else {
      window.addEventListener("load", handleReady);
      // Fallback timeout in case window.load takes too long
      const timer = setTimeout(handleReady, 1200);
      return () => {
        window.removeEventListener("load", handleReady);
        clearTimeout(timer);
      };
    }
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-400 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Brand Logo */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-pulse">
          <Image
            src="/logo.png"
            alt="Mytipe Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2b76a6] rounded-full animate-[shimmer_1.2s_infinite]" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}
