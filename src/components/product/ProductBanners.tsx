"use client";

import React from "react";
import Image from "next/image";
import { ProductImage } from "@/types/store";

interface ProductBannersProps {
  banner?: ProductImage;
  title: string;
}

export default function ProductBanners({ banner, title }: ProductBannersProps) {
  // If no banner is provided from the backend metafield, do not render this section
  if (!banner || !banner.url) return null;

  return (
    <section className="py-10 sm:py-14 bg-white border-t border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 group">
          <Image
            src={banner.url}
            alt={banner.altText || `${title} Official Promotional Banner`}
            width={banner.width || 2560}
            height={banner.height || 1097}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1720px"
            className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </section>
  );
}
