import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Sparkles, Footprints, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Us | Mytipe",
  description:
    "Learn about Mytipe — designing doctor-inspired toe alignment socks and daily foot wellness essentials for pain-free living.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* 1. Text-Only Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#0f1c3f]/5 text-[#0f1c3f] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#0f1c3f]/10">
          <Footprints className="w-3.5 h-3.5 text-[#2b76a6]" />
          <span>About Mytipe</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
          Designed for Movement. <br />
          <span className="text-[#2b76a6]">Built for Pain-Free Feet.</span>
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We craft therapeutic toe-alignment socks and wellness essentials that gently realign your toes, relieve everyday foot fatigue, and bring back natural movement.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/collections/all-socks"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg active:scale-98"
          >
            <span>Shop All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition"
          >
            <span>Contact Us</span>
          </Link>
        </div>
      </section>

      {/* 3. The Story & Real Alignment (2-Column with Real Product Photos) */}
      <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Visual Images Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200 shadow-md">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0753/9100/8966/files/135c983f-a8e6-4320-839c-286223563098_826e483e-7dc4-4ff4-a396-18ddb1823ca9.webp?v=1786097818"
                  alt="Toe Alignment Socks On Feet"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200 shadow-md translate-y-4">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0753/9100/8966/files/274583af-6f2a-4826-b724-fee3a1ed24b7.webp?v=1786097818"
                  alt="Toe Separator Spacer Detail"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Simple Text Column */}
            <div className="space-y-5 lg:pl-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2b76a6] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>The Problem &amp; The Fix</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                Your shoes squeeze your toes. <br />
                We give them room to stretch.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Everyday shoes force your toes into tight, unnatural points. Over time, this leads to bunions, hammertoes, plantar fasciitis, and painful arch ache.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Mytipe socks feature individually cushioned 5-toe spacers. By gently spreading each toe apart, they stimulate natural blood circulation, relieve pressure points, and retrain your natural balance.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Separates &amp; stretches toes to reduce bunion friction</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Soft, breathable combed cotton with durable stretch</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Wear while lounging, watching TV, yoga, or sleeping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Product Line Showcase (4 Clean Image Cards) */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase">
            What We Create
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Simple, high-performance essentials designed for everyday foot care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Foot Alignment Socks */}
          <Link
            href="/products/foot-alignment-socks"
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <Image
                src="/pain-sock.webp"
                alt="Foot Alignment Socks"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#2b76a6] transition">
                Pain Relief Socks
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                5-toe separation designed to reduce bunions and arch pressure.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f1c3f] pt-1">
                <span>View Product</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Card 2: Foot & Shoe Deo */}
          <Link
            href="/products/foot-shoe-deo"
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <Image
                src="/foot&shoedeo.webp"
                alt="Foot & Shoe Deodorizer Spray"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#2b76a6] transition">
                Foot &amp; Shoe Deodorizer
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                Long-lasting antibacterial spray that eliminates shoe odor.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f1c3f] pt-1">
                <span>View Product</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Card 3: Make Your Care Can */}
          <Link
            href="/make-your-care-can"
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <Image
                src="/carecan-hero.webp"
                alt="Make Your Care Can"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#2b76a6] transition">
                Make Your Care Can
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                Customizable gift can packed with your choice of premium socks.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f1c3f] pt-1">
                <span>Customize Can</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Card 4: Gym & Athletic Socks */}
          <Link
            href="/collections/gym-socks"
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <Image
                src="/gym-sock.webp"
                alt="Gym & Athletic Socks"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#2b76a6] transition">
                Performance Gym Socks
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                Cushioned sole &amp; dynamic arch support for daily workouts.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f1c3f] pt-1">
                <span>View Collection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Clean Trust Badges */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2 p-4">
            <ShieldCheck className="w-7 h-7 text-emerald-400 mx-auto" />
            <h4 className="font-black text-sm uppercase tracking-wider">30-Day Guarantee</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Try our socks with complete peace of mind. If you are not satisfied, we will make it right.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <Truck className="w-7 h-7 text-blue-400 mx-auto" />
            <h4 className="font-black text-sm uppercase tracking-wider">Express Dispatch</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Dispatched daily from our Dehradun facility. Free Cash on Delivery available across India.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <HeartHandshake className="w-7 h-7 text-amber-400 mx-auto" />
            <h4 className="font-black text-sm uppercase tracking-wider">Direct Customer Care</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Got a question? Reach us directly on WhatsApp or call +91 7310585356 Monday to Friday.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Simple Bottom CTA */}
      <section className="py-16 text-center bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Ready for healthier, happier feet?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Explore our best-selling alignment socks, deodorizers, and care cans.
          </p>
          <div className="pt-2">
            <Link
              href="/collections/all-socks"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg hover:shadow-xl active:scale-98"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
