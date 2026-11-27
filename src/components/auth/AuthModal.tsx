"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { X, ArrowRight, ShieldCheck, Sparkles, Lock } from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithPhone, quickTestLogin, authModalPrompt } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      trackEvent("form_validation_error", { form_name: "auth_otp_phone" });
      return;
    }
    setError("");
    setIsSubmitting(true);
    trackEvent("otp_requested", { form_name: "auth_modal" });
    // Simulate SMS OTP delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep(true);
      setOtp("7788"); // Auto-fill sample OTP for seamless frictionless UX
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError("Please enter the 4-digit OTP");
      trackEvent("form_validation_error", { form_name: "auth_otp_code" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithPhone(phoneNumber, name);
      trackEvent(
        "login",
        { method: "phone_otp" },
        { metaEvent: "CompleteRegistration", metaParams: { status: true } }
      );
      setIsSubmitting(false);
      setOtpStep(false);
      setPhoneNumber("");
      setOtp("");
      setError("");
      closeAuthModal();
    }, 400);
  };

  const handleDirectLogin = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    loginWithPhone(phoneNumber, name);
    setPhoneNumber("");
    setError("");
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[340px] sm:max-w-[390px] bg-white text-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col mx-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Brand Header with Official Logo */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4 sm:mb-5">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center">
            <Image
              src="/logo.webp"
              alt="Mytipe Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-1">
            {authModalPrompt && !otpStep && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full mb-0.5">
                <Lock className="w-2.5 h-2.5 text-amber-600" /> Checkout Sign In
              </span>
            )}
            <h2 className="text-lg sm:text-2xl font-black text-gray-950 uppercase tracking-tight">
              {otpStep ? "Verify Mobile OTP" : "Mobile Sign In"}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-normal max-w-xs mx-auto leading-relaxed">
              {otpStep
                ? `Enter OTP sent to +91 ${phoneNumber}`
                : authModalPrompt || "Sign in with your phone to access wallet coins & rewards"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium animate-in shake">
            {error}
          </div>
        )}

        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="space-y-3 sm:space-y-3.5">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 sm:py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-xs sm:text-sm font-bold text-gray-600 border-r border-slate-200 pr-2 pointer-events-none">
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
                    if (error) setError("");
                  }}
                  placeholder="98765 43210"
                  required
                  autoFocus
                  className="w-full pl-15 sm:pl-16 pr-3 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-gray-900 placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition"
                />
              </div>
            </div>

            <div className="pt-1.5 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting || phoneNumber.length < 10}
                className="w-full py-2.5 sm:py-3 bg-[#2b76a6] hover:bg-[#23638c] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? "Sending OTP..." : "Get OTP & Sign In"}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={handleDirectLogin}
                disabled={phoneNumber.length < 10}
                className="w-full py-1.5 text-[11px] sm:text-xs text-gray-500 hover:text-gray-900 font-bold transition text-center cursor-pointer disabled:opacity-40"
              >
                Instant 1-Click Phone Login &rarr;
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3 sm:space-y-3.5">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 text-center">
                Enter 4-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="7788"
                required
                autoFocus
                className="w-full px-3 py-2.5 text-center text-xl tracking-[0.4em] font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#2b76a6] focus:ring-2 focus:ring-[#2b76a6]/20 transition text-gray-950"
              />
              <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1.5 font-medium flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                <span>Simulated OTP: 7788 (auto-filled for instant testing)</span>
              </p>
            </div>

            <div className="pt-1.5 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting || otp.length < 4}
                className="w-full py-2.5 sm:py-3 bg-[#2b76a6] hover:bg-[#23638c] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? "Verifying..." : "Verify & Sign In"}</span>
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-full py-1.5 text-[11px] text-gray-500 hover:text-gray-800 font-bold transition text-center cursor-pointer"
              >
                &larr; Change Phone Number
              </button>
            </div>
          </form>
        )}

        {/* Quick Demo Login Option */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => {
              quickTestLogin();
              closeAuthModal();
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#2b76a6]" />
            <span>Quick 1-Click Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
