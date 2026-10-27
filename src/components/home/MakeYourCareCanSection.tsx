"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MakeYourCareCanSection() {
  return (
    <section className="py-6 sm:py-10 bg-white border-t border-slate-100">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-10 xl:p-12">
            {/* Left Column: Clean Minimalist Content */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block">
                India&apos;s First Grow-Plant Sock Can
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-950 uppercase tracking-tight leading-tight">
                Make Your Care Can
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-normal leading-relaxed max-w-lg">
                Pick your <strong>3 favorite pairs</strong> of socks, pack them into our recyclable care cylinder, and plant the embedded seed paper to watch living greens thrive.
              </p>

              <div className="pt-2 sm:pt-3">
                <Link
                  href="/make-your-care-can"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-black hover:bg-gray-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>BUILD YOUR CAN</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: 100% Fully Visible Image */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-full aspect-[1274/1052] max-h-[300px] sm:max-h-[340px] lg:max-h-[380px] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-50">
                <Image
                  src="/carecan-hero.png"
                  alt="Make Your Care Can - Fresh By Default with Plant"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
