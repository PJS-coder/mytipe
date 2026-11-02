"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircleQuestion } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQSectionProps {
  faqs?: FAQItem[];
  productTitle: string;
}

export default function ProductFAQSection({
  faqs = [],
  productTitle,
}: ProductFAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-8 sm:py-12 bg-white border-t border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
              <HelpCircle className="w-3 h-3" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-950 uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
              Everything you need to know about using and benefiting from {productTitle}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#0f1c3f] bg-slate-50/70 shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-[#0f1c3f] text-white"
                          : "bg-slate-100 text-gray-600"
                      }`}
                    >
                      <MessageCircleQuestion className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-4 pb-3.5 pt-0 pl-11 sm:pl-12 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
  );
}
