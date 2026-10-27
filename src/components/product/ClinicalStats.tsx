"use client";

import React from "react";
import { Check, X } from "lucide-react";

export default function ClinicalStats() {
  const tableData = [
    {
      feature: "Toe Separation & Alignment",
      mytipe: "Gentle plush knit dividers keep toes separated & naturally aligned",
      others: "Squeezes toes together, causing bunions & friction",
    },
    {
      feature: "Plantar Arch Support",
      mytipe: "Targeted 360° compression band relieves heel fatigue & morning stiffness",
      others: "Flat construction with zero arch stabilization",
    },
    {
      feature: "Material Quality",
      mytipe: "Premium combed organic cotton with micro-mesh airflow",
      others: "Synthetic polyester that traps heat and sweat",
    },
    {
      feature: "Non-Binding Comfort Band",
      mytipe: "Soft stay-up cuff that doesn't leave deep red marks on your skin",
      others: "Tight rubber elastic that restricts blood circulation",
    },
    {
      feature: "Day & Overnight Relaxation",
      mytipe: "Designed for comfortable wear while relaxing, sitting, or sleeping",
      others: "Not suitable for therapeutic resting",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why We Are Different From Other Socks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            A quick comparison between MYTIPE and ordinary market socks
          </p>
        </div>

        {/* Normal Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-700">
                  <th className="py-4 px-4 sm:px-6 w-1/3">Feature</th>
                  <th className="py-4 px-4 sm:px-6 w-1/3 text-blue-900 bg-blue-50/60 border-x border-slate-200">
                    <span className="font-black">MYTIPE Socks</span>
                  </th>
                  <th className="py-4 px-4 sm:px-6 w-1/3 text-slate-500">
                    Other Regular Socks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 sm:px-6 bg-blue-50/30 border-x border-slate-200 font-medium text-slate-900">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                        <span>{row.mytipe}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-500">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
