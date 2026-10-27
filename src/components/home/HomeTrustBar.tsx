"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, HeartPulse } from "lucide-react";

export default function HomeTrustBar() {
  const perks = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      desc: "Dispatched in 24 hrs across India",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      icon: ShieldCheck,
      title: "Cash on Delivery & UPI",
      desc: "Pay safely at your doorstep or via UPI",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      icon: RotateCcw,
      title: "7-Day Easy Exchange",
      desc: "Hassle-free size & defective replacement",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      icon: HeartPulse,
      title: "Anatomically Engineered",
      desc: "Doctor recommended for toe & arch relief",
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="w-full bg-[#f8fafc] border-y border-slate-200/80 py-4 sm:py-6">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 p-2 sm:p-3">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${p.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
