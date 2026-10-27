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
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="max-w-4xl xl:max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-3 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              Everything you need to know about using and benefiting from {productTitle}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#0f1c3f] bg-slate-50/70 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? "bg-[#0f1c3f] text-white"
                          : "bg-slate-100 text-gray-600"
                      }`}
                    >
                      <MessageCircleQuestion className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 pl-16 sm:pl-18 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
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
