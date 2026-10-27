"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth, WHEEL_SLICES } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { WheelSlice } from "@/types/auth";
import { X, Sparkles, ArrowRight, Coins } from "lucide-react";
import Link from "next/link";

// Web Audio sound synthesizer for ticking & win fanfare
function playTickSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.025);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.025);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  } catch {
    // ignore audio failure
  }
}

function playWinFanfare() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch {
    // ignore
  }
}

export default function SpinWheelModal() {
  const {
    isSpinWheelOpen,
    closeSpinWheel,
    recordSpinWin,
    user,
    isAuthenticated,
    loginWithPhone,
    hasClaimedWelcomeSpin,
  } = useAuth();
  const { openCart } = useCart();

  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonSlice, setWonSlice] = useState<WheelSlice | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentRotationRef = useRef(0);

  // Sync user's phone if already authenticated
  useEffect(() => {
    if (user?.phone) {
      setMobileNumber(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (isSpinWheelOpen) {
      if (user?.hasClaimedWelcomeSpin) {
        setWonSlice({
          id: 0,
          label: `${user.coins} COINS`,
          coins: user.coins,
          color: "#2b76a6",
          textColor: "#ffffff",
          isWinningEligible: true,
          weight: 0,
        });
        setShowCelebration(true);
      } else {
        setWonSlice(null);
        setShowCelebration(false);
      }
    }
  }, [isSpinWheelOpen, user]);

  if (!isSpinWheelOpen) return null;

  const totalSlices = WHEEL_SLICES.length;
  const sliceAngle = 360 / totalSlices; // 45 deg

  const handleSpinClick = () => {
    if (isSpinning) return;

    // Mobile Number validation
    const cleanPhone = mobileNumber.replace(/[^0-9]/g, "");
    if (!isAuthenticated && cleanPhone.length < 10) {
      setMobileError("Please enter a valid 10-digit mobile number to spin!");
      return;
    }
    setMobileError("");

    // Auto-login user with mobile number
    if (!isAuthenticated && cleanPhone.length >= 10) {
      loginWithPhone(cleanPhone);
    }

    setIsSpinning(true);
    setShowCelebration(false);
    setWonSlice(null);

    // Eligible winning slices (10 coins: ~54%, 20 coins: ~38%, 50 coins: ~6.5%, 100 coins: ~1.5%)
    const eligibleIndices = WHEEL_SLICES.map((s, idx) => ({ ...s, index: idx })).filter(
      (s) => s.isWinningEligible
    );

    // Pick winning slice based on weights
    const totalWeight = eligibleIndices.reduce((acc, s) => acc + (s.weight || 10), 0);
    let randomVal = Math.random() * totalWeight;
    let chosenSliceWithIndex = eligibleIndices[0];

    for (const slice of eligibleIndices) {
      if (randomVal < (slice.weight || 10)) {
        chosenSliceWithIndex = slice;
        break;
      }
      randomVal -= slice.weight || 10;
    }

    const targetSliceIndex = chosenSliceWithIndex.index;

    // 12 o'clock is at angle 270° in standard Cartesian coordinates.
    // Center angle of slice i:
    const sliceCenterAngle = targetSliceIndex * sliceAngle + sliceAngle / 2;
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.2); // subtle variation inside slice
    const targetRelativeAngle = (270 - sliceCenterAngle + jitter + 360) % 360;

    const extraRotations = 360 * 6; // 6 full rotations
    const currentBase = currentRotationRef.current;
    const currentModulo = currentBase % 360;
    const delta = (targetRelativeAngle - currentModulo + 360) % 360;
    const finalRotation = currentBase + extraRotations + delta;

    currentRotationRef.current = finalRotation;
    setRotation(finalRotation);

    // Sound ticking effect
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playTickSound();
      if (tickCount > 24) clearInterval(tickInterval);
    }, 160);

    // 4 second spin duration
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonSlice(chosenSliceWithIndex);
      setShowCelebration(true);
      playWinFanfare();
      recordSpinWin(chosenSliceWithIndex);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#f8f9fa] text-gray-900 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row items-center">
        
        {/* Big Top-Right Close Button */}
        <button
          onClick={closeSpinWheel}
          disabled={isSpinning}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-40 p-2 sm:p-2.5 text-gray-500 hover:text-gray-950 rounded-full bg-white/90 hover:bg-gray-200 border border-gray-200/80 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center"
          aria-label="Close"
          title="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* ================= LEFT HALF: THE ROTATING FORTUNE WHEEL ================= */}
        <div className="relative w-full md:w-1/2 min-h-[320px] sm:min-h-[380px] md:min-h-[460px] bg-slate-100/70 flex items-center justify-center overflow-hidden p-4 border-b md:border-b-0 md:border-r border-gray-200/80">
          
          {/* Wheel Container */}
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 flex items-center justify-center">
            
            {/* Pointer Needle at 12 o'clock (Top Center) pointing DOWN towards the center */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
              {/* Pointer Graphic */}
              <div className="relative flex flex-col items-center">
                {/* Pointer Hub Circle */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white" />
                </div>
                {/* Needle Arrow pointing down */}
                <div className="w-0 h-0 border-x-[12px] sm:border-x-[14px] border-x-transparent border-t-[24px] sm:border-t-[28px] border-t-black -mt-1.5" />
              </div>
            </div>

            {/* Outer Rim Border */}
            <div className="absolute inset-0 rounded-full border-[6px] border-gray-300 pointer-events-none z-10 shadow-inner" />

            {/* Rotating SVG Wheel */}
            <div
              className="w-full h-full rounded-full overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.12, 0.8, 0.32, 1) shadow-xl"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {WHEEL_SLICES.map((slice, idx) => {
                  const startAngle = idx * sliceAngle;
                  const endAngle = startAngle + sliceAngle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 200 + 200 * Math.cos(startRad);
                  const y1 = 200 + 200 * Math.sin(startRad);
                  const x2 = 200 + 200 * Math.cos(endRad);
                  const y2 = 200 + 200 * Math.sin(endRad);

                  const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;

                  // Calculate text positioning along the radius
                  const textAngle = startAngle + sliceAngle / 2;
                  const textRad = (textAngle * Math.PI) / 180;
                  const textX = 200 + 130 * Math.cos(textRad);
                  const textY = 200 + 130 * Math.sin(textRad);

                  // Outer peg dot at the edge
                  const pegRad = (startAngle * Math.PI) / 180;
                  const pegX = 200 + 192 * Math.cos(pegRad);
                  const pegY = 200 + 192 * Math.sin(pegRad);

                  return (
                    <g key={slice.id}>
                      {/* Slice Path */}
                      <path
                        d={pathData}
                        fill={slice.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                      {/* Rim Peg Dot */}
                      <circle
                        cx={pegX}
                        cy={pegY}
                        r="3.5"
                        fill="#1e293b"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />

                      {/* Slice Label Text */}
                      <text
                        x={textX}
                        y={textY}
                        fill={slice.textColor}
                        fontSize={slice.label.length > 12 ? "12" : "14"}
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                        className="select-none tracking-tight uppercase"
                      >
                        {slice.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Circular SPIN Button */}
            <button
              onClick={handleSpinClick}
              disabled={isSpinning || hasClaimedWelcomeSpin}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0f1c3f] hover:bg-[#1a2e66] active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl border-4 border-white flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 disabled:opacity-80"
              title="Click to Spin the Wheel"
            >
              <span className="leading-none text-amber-400 font-extrabold text-[10px] sm:text-xs">
                ★
              </span>
              <span className="leading-none tracking-widest text-white font-black">
                {isSpinning ? "..." : "SPIN"}
              </span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT HALF: WANT TO PLAY & MOBILE AUTH FORM ================= */}
        <div className="relative w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#f8f9fa] min-h-[380px] sm:min-h-[440px]">
          
          {/* Top Row: Brand Logo */}
          <div className="flex items-center mb-3">
            <div className="flex items-center gap-2">
              {/* Blue Badge Icon */}
              <div className="w-7 h-7 rounded-lg bg-[#2b76a6] flex items-center justify-center text-white font-black text-sm shadow-sm">
                M
              </div>
              <span className="text-base font-black tracking-widest text-gray-950 uppercase">
                MYTIPE
              </span>
            </div>
          </div>

          {!showCelebration ? (
            /* ================= INITIAL PLAY & MOBILE FORM STATE ================= */
            <div className="space-y-3.5">
              {/* Heading */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  Want to Play ?
                </h2>
              </div>

              {/* Progress Bar: 75% offers claimed */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2b76a6] to-[#5aa9d6] rounded-full transition-all duration-700"
                    style={{ width: "75%" }}
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-600">
                  75% offers claimed. Hurry up!
                </p>
              </div>

              {/* Coins & Rewards Highlight Box */}
              <div className="p-2.5 bg-slate-100/90 border border-slate-200 rounded-2xl flex items-center gap-2 text-xs text-slate-900 font-bold">
                <Coins className="w-5 h-5 text-[#2b76a6] shrink-0" />
                <div>
                  <span>Win 10, 20, 50 or 100 Mytipe Coins!</span>
                  <span className="block text-[10px] text-slate-600 font-semibold">
                    1 Coin = ₹1 Instant Discount at checkout!
                  </span>
                </div>
              </div>

              {/* Subtitles & Rules */}
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-gray-900 text-xs sm:text-sm">
                  Chance to win Big &amp; Nothing to Lose!
                </p>
                <p className="text-gray-500 italic text-[11px]">
                  * Win Coins directly credited to your wallet balance.
                </p>
                <p className="text-gray-500 italic text-[11px]">
                  * You can spin the wheel once per mobile number.
                </p>
              </div>

              {/* Mobile Number Input */}
              <div className="space-y-2 pt-1">
                {!isAuthenticated ? (
                  <div>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-gray-500 border-r border-gray-300 pr-2 pointer-events-none">
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/[^0-9]/g, ""));
                          if (mobileError) setMobileError("");
                        }}
                        placeholder="Your mobile number here"
                        className="w-full pl-14 pr-4 py-3 bg-gray-200/80 hover:bg-gray-200 focus:bg-white text-gray-900 placeholder:text-gray-500 font-medium text-sm rounded-xl border border-transparent focus:border-gray-400 focus:outline-none transition shadow-inner"
                      />
                    </div>
                    {mobileError && (
                      <p className="text-red-600 text-xs font-semibold mt-1">
                        {mobileError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-800">
                    <span className="font-semibold">
                      Mobile: +91 {user?.phone || mobileNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-blue-100 text-[#2b76a6] px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                )}

                {/* SPIN TO WIN Button */}
                <button
                  onClick={handleSpinClick}
                  disabled={isSpinning || hasClaimedWelcomeSpin}
                  className="w-full py-3.5 sm:py-4 bg-[#2b76a6] hover:bg-[#23638c] active:scale-98 text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-xl transition shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  <span>{isSpinning ? "SPINNING..." : "SPIN TO WIN COINS!"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= CELEBRATION / WON COINS STATE ================= */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#2b76a6] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2b76a6]" />
                <span>Congratulations!</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  You Won {wonSlice?.coins || 10} Mytipe Coins!
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Added directly to your wallet. You can redeem your coins for discounts at checkout.
                </p>
              </div>

              {/* Coins Wallet Card */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/80 border-2 border-blue-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#2b76a6] text-white flex items-center justify-center shadow-md">
                    <Coins className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">
                      Wallet Balance
                    </span>
                    <span className="text-xl font-black text-slate-900 tracking-wide">
                      {user?.coins || wonSlice?.coins || 10} Coins (₹{user?.coins || wonSlice?.coins || 10})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold bg-blue-100 text-[#2b76a6] px-2.5 py-1 rounded-full uppercase">
                    1 Coin = ₹1
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeSpinWheel();
                    openCart();
                  }}
                  className="w-full py-3.5 bg-[#2b76a6] hover:bg-[#23638c] text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Redeem Coins &amp; View Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/collections/all-socks"
                  onClick={closeSpinWheel}
                  className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center text-center"
                >
                  Shop Best Sellers
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Skip Action */}
          <div className="flex justify-end pt-3">
            <button
              onClick={closeSpinWheel}
              disabled={isSpinning}
              className="text-xs text-gray-400 hover:text-gray-700 font-medium flex items-center gap-1 transition cursor-pointer disabled:opacity-30"
            >
              <span>Skip it!</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


