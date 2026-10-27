"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
  title: string;
  href: string;
  image: string;
  alt: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Foot & Shoe Deo",
    href: "/collections/all-socks",
    image: "/foot&shoedeo.webp",
    alt: "Mytipe Foot & Shoe Freshener Deo",
  },
  {
    title: "Pain Relief Socks",
    href: "/products/black-foot-alignment-socks",
    image: "/pain-sock.webp",
    alt: "Mytipe Pain Relief Toe Alignment Socks",
  },
  {
    title: "Gym socks",
    href: "/collections/all-socks",
    image: "/gym-sock.webp",
    alt: "Mytipe Athletic Gym Socks",
  },
  {
    title: "Office Socks",
    href: "/collections/all-socks",
    image: "/office-sock.webp",
    alt: "Mytipe Everyday Office Formal Socks",
  },
];

export default function CategoryCards() {
  return (
    <section className="py-8 sm:py-14 bg-[#faf7f2]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* 4 Category Cards in a Row using official assets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative aspect-3/4 sm:aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block bg-slate-200"
            >
              {/* Official Category Image */}
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
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
