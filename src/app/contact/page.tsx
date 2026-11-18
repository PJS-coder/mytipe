"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "Order Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        orderNumber: "",
        subject: "Order Inquiry",
        message: "",
      });
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900">
      {/* 1. Header Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-14 sm:py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0f1c3f]/5 text-[#0f1c3f] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#0f1c3f]/10">
            <Mail className="w-3.5 h-3.5 text-[#2b76a6]" />
            <span>We&apos;re Here For You</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Contact Mytipe Support
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have questions about your order, shipping status, product sizing, or foot care? Reach out to our dedicated support team in Dehradun.
          </p>
        </div>
      </section>

      {/* 2. Main Content: Contact Cards + Contact Form */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Get in Touch Directly
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Reach us via phone, email, or visit our headquarters.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-4 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0f1c3f] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer Care Phone
                  </p>
                  <a
                    href="tel:7310585356"
                    className="text-base font-black text-slate-900 hover:text-[#2b76a6] transition block"
                  >
                    +91 7310585356
                  </a>
                  <p className="text-[11px] text-slate-500">
                    Call or WhatsApp support available
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-4 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Official Support Email
                  </p>
                  <a
                    href="mailto:muditmalhotra101@gmail.com"
                    className="text-sm sm:text-base font-black text-slate-900 hover:text-[#2b76a6] transition break-all block"
                  >
                    muditmalhotra101@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-500">
                    Responses within 24 business hours
                  </p>
                </div>
              </div>

              {/* Address Card */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-4 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Corporate Office &amp; Warehouse
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    1st Floor, Laxmi Enclave, Derakhas, Near Indresh Hospital, Dehradun, Uttarakhand – 248001
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-4 hover:border-slate-300 transition">
                <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Operating Hours
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Monday to Friday: 9:00 AM – 6:00 PM IST
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Orders dispatch daily from Monday through Saturday
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg shadow-slate-100">
              <div className="space-y-2 mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Fill in your details below and our team will get back to you promptly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">
                      Message Received Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                      Thank you for contacting Mytipe. We have assigned a support ticket and will reach out to you via email or phone within 24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f1c3f] hover:underline pt-2 cursor-pointer"
                  >
                    Send another inquiry &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Order Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        placeholder="e.g. MYTIPE-1042"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
                    >
                      <option value="Order Inquiry">Track Existing Order</option>
                      <option value="Product Sizing">Product &amp; Sizing Recommendation</option>
                      <option value="Returns & Exchange">Returns &amp; 30-Day Guarantee</option>
                      <option value="Bulk Order">Bulk &amp; Corporate Gifting</option>
                      <option value="Other">General Feedback / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know how we can help you..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#0f1c3f] hover:bg-[#1a2e66] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Your Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Inquiry Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick FAQ Strip */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Quick answers to the questions our customers ask most often.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2b76a6]" />
                How soon will my order be dispatched?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orders placed before 2:00 PM are dispatched on the same day. Express delivery takes 2 to 4 working days across all major Indian cities.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                What is your return &amp; exchange policy?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We offer a 30-Day Satisfaction Guarantee. If you face any sizing or manufacturing defect, reach out to us and we’ll arrange a swift exchange.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Is Cash on Delivery (COD) supported?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Free Cash on Delivery is available across 19,000+ pin codes throughout India with no hidden handling fees.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                How often should I wear alignment socks?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We recommend starting with 20 to 30 minutes a day while relaxing or watching TV, gradually building up to wearing them overnight for optimal toe relief.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
