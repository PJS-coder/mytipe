"use client";

import React from "react";

export default function ProductFootCareIntro() {
  return (
    <section className="w-full bg-white pt-10 sm:pt-14">
      {/* Heading & Subheading (Clean white background) */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
          A little care for your hardest-working feet
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
          Give your feet a comfortable break after a busy day.
        </p>
      </div>

      {/* 100% Full-Width Blue Box - Edge-to-Edge with ZERO right/left space */}
      <div className="w-full bg-[#2b76a6] text-white shadow-sm">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {/* 1. Space for every toe */}
            <div className="py-6 md:py-2 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Clean Frosted Icon Badge (No clunky black box) */}
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg
                      className="w-7 h-7 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="5" cy="4" r="1.3" fill="currentColor" />
                      <circle cx="8.5" cy="2.5" r="1.3" fill="currentColor" />
                      <circle cx="12" cy="2.5" r="1.3" fill="currentColor" />
                      <circle cx="15.5" cy="3.5" r="1.3" fill="currentColor" />
                      <circle cx="18.5" cy="5" r="1.3" fill="currentColor" />
                      <path
                        d="M4 11c0-2 2-3.5 5-3.5h2c3 0 5 1.5 5 3.5v2c0 4-3 7-7 7s-7-3-7-7v-2z"
                        fill="currentColor"
                        fillOpacity="0.25"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white border border-white/25">
                    Toe Alignment
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mb-1.5 tracking-tight">
                  Space for every toe
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  Separate toe openings help keep each toe comfortably positioned.
                </p>
              </div>
            </div>

            {/* 2. Soft against your skin */}
            <div className="py-6 md:py-2 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg
                      className="w-7 h-7 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
                        fill="currentColor"
                        fillOpacity="0.25"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white border border-white/25">
                    Gentle Touch
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mb-1.5 tracking-tight">
                  Soft against your skin
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  A soft cotton blend for a gentle, cosy feel.
                </p>
              </div>
            </div>

            {/* 3. Breathable comfort */}
            <div className="py-6 md:py-2 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg
                      className="w-7 h-7 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white border border-white/25">
                    AirFlow Knit
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mb-1.5 tracking-tight">
                  Breathable comfort
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  Airy fabric helps your feet feel fresh while you unwind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
