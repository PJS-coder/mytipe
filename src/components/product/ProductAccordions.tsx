"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, Ruler, WashingMachine, ShieldCheck, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductAccordionsProps {
  faqs?: FAQItem[];
  description?: string;
  descriptionHtml?: string;
}

export default function ProductAccordions({
  faqs = [],
}: ProductAccordionsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const accordionItems = [
    {
      id: "shipping",
      title: "Shipping & Delivery Information",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      content: (
        <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
          <p>
            🚚 <strong>Fast Dispatch:</strong> Orders are dispatched from our warehouse within 24 hours. Estimated delivery: 2-4 business days across India.
          </p>
          <p>
            💵 <strong>Cash on Delivery (COD):</strong> 100% Free COD available on orders above ₹449.
          </p>
          <p>
            🛡️ <strong>Guarantee:</strong> Quality assured with 100% genuine products directly from Mytipe.
          </p>
        </div>
      ),
    },
    ...(faqs && faqs.length > 0
      ? [
          {
            id: "faq",
            title: "Frequently Asked Questions",
            icon: <HelpCircle className="w-4 h-4 text-blue-600" />,
            content: (
              <div className="space-y-4 text-sm text-gray-600">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                    <h4 className="font-bold text-gray-900 text-sm">{faq.question}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {accordionItems.map((item) => {
        const isOpen = openSection === item.id;
        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm sm:text-base hover:text-blue-700 transition"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="pt-3 pb-1 pl-7 animate-in fade-in slide-in-from-top-1 duration-200">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
