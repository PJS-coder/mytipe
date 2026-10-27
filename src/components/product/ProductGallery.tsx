"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/store";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  badge?: string;
}

export default function ProductGallery({ images, title, badge }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="lg:sticky lg:top-28 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 xl:gap-6 items-start w-full">
      {/* Sub Images / Thumbnails on the Left Side */}
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 sm:gap-3 xl:gap-4 w-full sm:w-20 md:w-24 xl:w-28 2xl:w-32 sm:shrink-0 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] xl:max-h-[720px] 2xl:max-h-[820px] py-1 custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square w-16 sm:w-20 md:w-24 xl:w-28 2xl:w-32 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border-2 transition-all cursor-pointer shrink-0 ${
                selectedIndex === idx
                  ? "border-[#0f1c3f] ring-2 ring-[#0f1c3f]/20 scale-95 shadow-md"
                  : "border-gray-200 hover:border-slate-400 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 70px, (max-width: 1280px) 100px, 140px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display on the Right */}
      <div className="relative aspect-square flex-1 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
        {activeImage && (
          <Image
            src={activeImage.url}
            alt={activeImage.altText || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 60vw, 1000px"
            className="object-cover object-center transition-all duration-300"
          />
        )}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#ffe4e6] text-[#e11d48] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
