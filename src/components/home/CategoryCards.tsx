"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/utils";

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
    href: "/products/pain-relief-socks",
    image: "/pain-sock.webp",
    alt: "Mytipe Pain Relief Toe Alignment Socks",
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
    <section className="py-2 sm:py-10 lg:py-14 bg-[#faf7f2] border-b border-gray-100/80">
      <div className="max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Mobile View: 2-Line Larger Category Cards (3 on top, 2 centered below) */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:hidden">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="flex flex-col items-center group cursor-pointer w-[calc(33.333%-7px)] max-w-[130px]"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-2xs border border-gray-200/80 group-active:scale-95 transition-transform duration-200">
                <Image
                  src={getOptimizedImageUrl(cat.image, 300)}
                  alt={cat.alt}
                  fill
                  unoptimized
                  sizes="33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-semibold text-gray-800 text-center mt-1.5 leading-tight line-clamp-2 px-0.5 h-[28px] flex items-center justify-center">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop / Tablet View: Original Category Cards with Pills */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block bg-slate-200"
            >
              {/* Official Category Image */}
              <Image
                src={getOptimizedImageUrl(cat.image, 600)}
                alt={cat.alt}
                fill
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
