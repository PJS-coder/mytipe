"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { trackClick, trackEvent } from "@/lib/analytics/trackEvent";

const PAIR_PACKS = [
  { label: "Pair of 1", href: "/products/foot-alignment-socks?pack=1", tag: "Starter" },
  { label: "Pair of 2", href: "/products/foot-alignment-socks?pack=2", tag: "Popular" },
  { label: "Pair of 3", href: "/products/foot-alignment-socks?pack=3", tag: "Value" },
  { label: "Pair of 6", href: "/products/foot-alignment-socks?pack=6", tag: "Best Value" },
];

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

            {/* Pairs Section (1, 2, 3, 6 Pairs - No Prices) */}
            <div className="pt-1 space-y-2.5">
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Choose Your Pack
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {PAIR_PACKS.map((pack) => (
                  <Link
                    key={pack.label}
                    href={pack.href}
                    onClick={() =>
                      trackEvent("pair_pack_click", {
                        button_name: pack.label,
                        button_location: "story_section",
                        element_type: "pack_card",
                      })
                    }
                    className="group relative flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-[#1e384c] hover:border-[#1e384c] transition-all duration-200 text-center shadow-2xs"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2b76a6] group-hover:text-sky-200">
                      {pack.tag}
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 group-hover:text-white mt-0.5">
                      {pack.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products/foot-alignment-socks"
                onClick={() => trackClick("SHOP NOW", "story_section", { element_type: "cta_link" })}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#1e384c] hover:bg-[#152a3a] text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-md hover:shadow-lg transition-all"
              >
                <span>SHOP NOW</span>
                <span className="ml-2 font-normal">&gt;</span>
              </Link>
            </div>
          </div>

          {/* Right Image Showcase with /pain-sock.png */}
          <Link
            href="/products/foot-alignment-socks"
            className="relative aspect-square sm:aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-slate-50 border border-slate-100 group block cursor-pointer"
          >
            <Image
              src="/pain-sock.webp"
              alt="Mytipe Foot Alignment Socks"
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_75%] group-hover:scale-[1.02] transition-transform duration-500"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
