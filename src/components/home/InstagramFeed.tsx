"use client";

import React, { useRef } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface ReelItem {
  id: number;
  videoSrc: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: 1,
    videoSrc: "/vid1.mp4",
  },
  {
    id: 2,
    videoSrc: "/vid2.mp4",
  },
  {
    id: 3,
    videoSrc: "/vid3.mp4",
  },
];

function ReelCard({ reel }: { reel: ReelItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <a
      href="https://www.instagram.com/mytipeofficial/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-md border border-slate-200 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl block"
      title="View on Instagram @mytipeofficial"
    >
      {/* 100% Clean Video - Zero Overlays */}
      <video
        ref={videoRef}
        src={reel.videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </a>
  );
}

export default function InstagramFeed() {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 text-pink-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-pink-200">
              <svg className="w-3.5 h-3.5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@mytipeofficial</span>
              <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight uppercase">
              Follow Us On Instagram
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Watch real viral customer reels &amp; toe alignment transformations. Click any video to open our Instagram!
            </p>
          </div>

          <a
            href="https://www.instagram.com/mytipeofficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-2xl shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Follow @mytipeofficial</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Medium Balanced Video Grid - Zero Text / UI Overlays */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {REELS_DATA.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        {/* Bottom CTA to view all reels on Instagram */}
        <div className="text-center pt-1">
          <a
            href="https://www.instagram.com/mytipeofficial/reels/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900 hover:text-pink-600 transition"
          >
            <span>WATCH ALL REELS ON INSTAGRAM</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
