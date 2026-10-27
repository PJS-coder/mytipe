"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function ReviewsGrid() {
  return (
    <section className="py-16 sm:py-24 bg-[#faf7f2] border-t border-slate-200/80">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current text-amber-500" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 uppercase tracking-tight">
            OVER 300,000+ PAIRS SOLD
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Real customer stories and reviews from daily wearers across India
          </p>
        </div>

        {/* 4 Column Interlocking Masonry Grid - Clean & Minimal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* COLUMN 1: Image on Top, Review on Bottom */}
          <div className="space-y-6">
            <div className="relative aspect-3/4 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 group">
              <Image
                src="https://cdn.shopify.com/s/files/1/0753/9100/8966/files/Black-Ankle-Socks-4.jpg?v=1786029931"
                alt="MYTIPE Black Ankle Socks on feet customer review photo"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-xs border border-gray-100 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                ))}
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm">Dr. Priyanka Rai</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                I bought it for my mom..she was facing severe foot pain for many months..even we consulted doctor but no lasting solution was found..then I bought these amazing socks which relieved pain completely... Thank you Mytipe!
              </p>
            </div>
          </div>

          {/* COLUMN 2: Image on Top, Review on Bottom */}
          <div className="space-y-6">
            <div className="relative aspect-4/3 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 group">
              <Image
                src="https://cdn.shopify.com/s/files/1/0753/9100/8966/files/Brave-4.jpg?v=1786282778"
                alt="MYTIPE Brave Mode Socks on feet customer review photo"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-xs border border-gray-100 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                ))}
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm">Dinesh Mathur</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                This is an excellent product. It has reduced my foot pain and most importantly the numbness in my feet after standing all day. Wear it every evening to see the results. The swelling in my feet is gone and it makes me feel far more energetic.
              </p>
            </div>
          </div>

          {/* COLUMN 3: Review on Top, Image on Bottom */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-xs border border-gray-100 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                ))}
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm">Sneha R.</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                I have flat feet and work 9+ hours in formal shoes. These socks are the only pair that maintain tension without leaving deep red band marks on my calves. Super breathable and zero sweat smell. Wearing them every single day now!
              </p>
            </div>

            <div className="relative aspect-3/4 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 group">
              <Image
                src="https://cdn.shopify.com/s/files/1/0753/9100/8966/files/White-ankle-socks-5.jpg?v=1786545033"
                alt="MYTIPE Legacy White Ankle Socks on feet customer photo"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* COLUMN 4: Image on Top, Review on Bottom */}
          <div className="space-y-6">
            <div className="relative aspect-4/5 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm bg-slate-100 border border-slate-200 group">
              <Image
                src="https://cdn.shopify.com/s/files/1/0753/9100/8966/files/Keep-Going-4.jpg?v=1786282462"
                alt="MYTIPE Keep Going Socks on feet customer photo"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-xs border border-gray-100 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                ))}
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm">Rahul M.</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Bought for my mother who suffered from morning heel stiffness. Within 2 weeks of wearing them while resting, the knee tension and heel pain reduced significantly. Just ordered 3 more pairs for my father and aunt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
