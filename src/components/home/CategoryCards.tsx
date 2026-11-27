"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/trackEvent";

interface CategoryItem {
  title: string;
  href: string;
  image: string;
  alt: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Combos",
    href: "/collections/combos",
    image: "https://cdn.shopify.com/s/files/1/0753/9100/8966/files/ChatGPT-Image-Jun-27-2026-02_42_41-AM-1.webp?v=1785136660",
    alt: "Mytipe Value Combos",
  },
  {
    title: "Foot & Shoe Deo",
    href: "/products/foot-shoe-deo",
    image: "/foot&shoedeo.webp",
    alt: "Mytipe Foot & Shoe Freshener Deo",
  },
  {
    title: "Pain Relief Socks",
    href: "/products/foot-alignment-socks",
    image: "/pain-sock.webp",
    alt: "Mytipe Pain Relief Socks",
  },
  {
    title: "Gym Socks",
    href: "/collections/gym-socks",
    image: "/gym-sock.webp",
    alt: "Mytipe Athletic Gym Socks",
  },
  {
    title: "Office Socks",
    href: "/collections/office-socks",
    image: "/office-sock.webp",
    alt: "Mytipe Everyday Office Formal Socks",
  },
];

export default function CategoryCards() {
  return (
    <section className="py-8 sm:py-14 bg-[#faf7f2] border-b border-gray-100/80">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Category Cards Grid (Unified Desktop & Mobile Format with Translucent Pills) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              onClick={() =>
                trackEvent("category_click", {
                  button_name: cat.title,
                  button_location: "home_category_cards",
                  element_type: "category_card",
                })
              }
              className={`group relative aspect-3/4 sm:aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block bg-slate-200 ${
                idx === 0 ? "col-span-2 md:col-span-1 aspect-[16/9] md:aspect-4/5" : ""
              }`}
            >
              {/* Official Category Image */}
              <Image
                src={getOptimizedImageUrl(cat.image, 600)}
                alt={cat.alt}
                fill
                loading="eager"
                unoptimized
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gentle overlay for pill readability */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />

              {/* Centered Translucent Pill Button */}
              <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                <span className="px-4 sm:px-6 py-2 sm:py-2.5 bg-black/35 group-hover:bg-black/55 backdrop-blur-md border border-white/70 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg group-hover:scale-105 transition-all duration-200 text-center">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
