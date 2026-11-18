"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function StorySection() {
  return (
    <section className="py-12 sm:py-20 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="space-y-5 lg:pr-6">
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-gray-500 uppercase">
              BEST SELLERS
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
              End Foot Pain. Realign Your Toes. Walk With Freedom
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              The Mytipe Foot Alignment Socks are designed to separate, stretch and align your toes which helps in relieving the pressure and provide reinforcement to your feet.
            </p>

            <div className="pt-2">
              <Link
                href="/products/pain-relief-socks"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#1e384c] hover:bg-[#152a3a] text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-md hover:shadow-lg transition-all"
              >
                <span>SHOP NOW</span>
                <span className="ml-2 font-normal">&gt;</span>
              </Link>
            </div>
          </div>

          {/* Right Image Showcase with /pain-sock.png */}
          <Link
            href="/products/pain-relief-socks"
            className="relative aspect-square sm:aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-slate-50 border border-slate-100 group block cursor-pointer"
          >
            <Image
              src="/pain-sock.webp"
              alt="Mytipe Pain Relief Foot Alignment Socks"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_75%] group-hover:scale-[1.02] transition-transform duration-500"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
