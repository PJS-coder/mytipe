"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { openRazorpayCheckout } from "@/lib/razorpay/client";
import { formatPrice } from "@/lib/utils";
import { calculateCartMilestones, CART_MILESTONES } from "@/lib/constants/cart";
import {
  ShieldCheck,
  Lock,
  Truck,
  ArrowLeft,
  Coins,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalSavings, clearCart } = useCart();
  const { user, isAuthenticated, isLoading, openAuthModal, spendCoins } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Delhi",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [applyCoins, setApplyCoins] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Prefill customer data if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || (user.email?.endsWith("@mytipe.user") ? "" : user.email) || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Auto open auth modal if visited directly while not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal({ prompt: "Please sign in with your phone to complete your order" });
    }
  }, [isLoading, isAuthenticated, openAuthModal]);

  // Milestone Calculations
  const { tierDiscount, isCheckoutUnlocked } = calculateCartMilestones(subtotal);
  const shippingFee = isCheckoutUnlocked ? 0 : 50;
  const userCoins = user?.coins || 0;
  const maxUsableCoins = Math.min(userCoins, Math.floor(Math.max(0, subtotal - tierDiscount)));
  const coinsDiscountAmount = applyCoins ? maxUsableCoins : 0;
  const finalTotal = Math.max(0, subtotal - tierDiscount - couponDiscount - coinsDiscountAmount + shippingFee);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit phone number is required";
    if (!formData.addressLine1.trim()) errors.addressLine1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.pincode.trim() || formData.pincode.length < 6) errors.pincode = "Valid 6-digit PIN code required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    if (code === "WELCOME10" || code === "MYTIPE10") {
      const discount = Math.round(subtotal * 0.1);
      setCouponDiscount(discount);
      setCouponSuccess(`Coupon ${code} applied! ₹${discount} saved`);
    } else if (code === "FREESHIP") {
      setCouponSuccess("Free delivery unlocked!");
    } else {
      setCouponError("Invalid coupon code. Try 'WELCOME10'");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal({ prompt: "Please sign in with your phone to complete your order" });
      return;
    }
    if (!validateForm()) return;
    if (items.length === 0) {
      alert("Your cart is empty!");
      router.push("/collections/all-socks");
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "razorpay") {
        // 1. Create Razorpay Order on our TypeScript Backend
        const res = await fetch("/api/checkout/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items,
            tierDiscount,
            coinDiscount: coinsDiscountAmount + couponDiscount,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to initialize Razorpay checkout");
        }

        const internalOrderId = data.orderId;

        // If Razorpay is in mock mode (test environment without live credentials)
        if (data.isMock) {
          // Verify directly and proceed
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: internalOrderId,
              razorpayOrderId: data.razorpayOrderId,
              razorpayPaymentId: `pay_test_${Date.now()}`,
              razorpaySignature: "mock_signature_approved",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            if (applyCoins && maxUsableCoins > 0) {
              spendCoins(maxUsableCoins, `Redeemed on Order #${data.orderNumber}`);
            }
            clearCart();
            router.push(`/order-success?orderId=${internalOrderId}`);
            return;
          }
        }

        // Open live Razorpay standard popup
        await openRazorpayCheckout({
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "MYTIPE Foot Care",
          description: `Order #${data.orderNumber} - ${items.length} item(s)`,
          image: "https://mytipe.in/logo.png",
          order_id: data.razorpayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#dc2626", // Mytipe Brand Red
          },
          handler: async (response) => {
            try {
              // 2. Verify Razorpay HMAC signature on backend
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: internalOrderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                if (applyCoins && maxUsableCoins > 0) {
                  spendCoins(maxUsableCoins, `Redeemed on Order #${data.orderNumber}`);
                }
                clearCart();
                router.push(`/order-success?orderId=${internalOrderId}`);
              } else {
                alert("Payment verification failed. Please contact support if money was deducted.");
              }
            } catch (err) {
              console.error("Verification error:", err);
              alert("Payment confirmation encountered an issue. Please contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        });
      } else {
        // Cash on Delivery
        const res = await fetch("/api/orders/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items,
            tierDiscount,
            coinDiscount: coinsDiscountAmount + couponDiscount,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to place COD order");
        }

        if (applyCoins && maxUsableCoins > 0) {
          spendCoins(maxUsableCoins, `Redeemed on Order #${data.order.orderNumber}`);
        }

        clearCart();
        router.push(`/order-success?orderId=${data.order.id}`);
      }
    } catch (error: unknown) {
      console.error("Order submission error:", error);
      const msg = error instanceof Error ? error.message : "Something went wrong while placing your order";
      alert(msg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2b76a6]" />
        <p className="text-xs text-gray-500 mt-2 font-medium">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Add some therapeutic socks or foot care essentials before proceeding to checkout.
        </p>
        <Link
          href="/collections/all-socks"
          className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full font-semibold transition"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-neutral-50/50">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-5">
          <div className="w-14 h-14 bg-blue-50 text-[#2b76a6] rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight">
              Sign In to Complete Purchase
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Please sign in with your mobile number to access secure checkout, redeem wallet coins, and track your order.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal({ prompt: "Please sign in with your phone to complete your order" })}
            className="w-full py-3.5 px-4 bg-[#0f1c3f] hover:bg-[#1a2e66] active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In with Mobile</span>
          </button>
          <div className="pt-2">
            <Link
              href="/cart"
              className="text-xs text-gray-500 hover:text-gray-900 font-medium underline underline-offset-4"
            >
              &larr; Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20 pt-4 sm:pt-6 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-200/60 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>256-bit SSL Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          {/* LEFT COLUMN: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 w-full min-w-0">
            <form onSubmit={handleSubmitOrder} className="space-y-6 sm:space-y-8" id="checkout-form">
              {/* 1. Contact Information */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">1. Contact Information</h2>
                  {!user && (
                    <Link href="/account" className="text-xs text-red-600 hover:underline font-medium">
                      Already have an account? Sign In
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition ${
                        formErrors.fullName ? "border-red-500 bg-red-50/20" : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rahul@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition ${
                        formErrors.email ? "border-red-500 bg-red-50/20" : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-semibold text-gray-500">+91</span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        placeholder="9876543210"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition ${
                          formErrors.phone ? "border-red-500 bg-red-50/20" : "border-gray-300 focus:border-black"
                        }`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">2. Shipping Address</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      House / Flat No., Street, Area *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Green Valley Apartments, MG Road"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition ${
                        formErrors.addressLine1 ? "border-red-500 bg-red-50/20" : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {formErrors.addressLine1 && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.addressLine1}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Apartment, Suite, Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="e.g. Near City Hospital"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 outline-none focus:border-black transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. New Delhi"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition ${
                        formErrors.city ? "border-red-500 bg-red-50/20" : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {formErrors.city && <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 outline-none focus:border-black transition bg-white"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Punjab">Punjab</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Other">Other State / UT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      placeholder="110001"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition ${
                        formErrors.pincode ? "border-red-500 bg-red-50/20" : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {formErrors.pincode && <p className="text-xs text-red-500 mt-1">{formErrors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200/80 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">3. Payment Method</h2>
                  <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                    <Lock className="w-3.5 h-3.5 text-gray-400" /> Encrypted & Safe
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Online */}
                  <label
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "razorpay"
                        ? "border-red-600 bg-red-50/30 ring-1 ring-red-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="mt-1 text-red-600 focus:ring-red-500 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-1.5 sm:gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <CreditCard className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                            Pay Online (Razorpay)
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                          Fastest Delivery
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed break-words">
                        Instant UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking & Wallets
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-gray-100 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-gray-700 font-semibold whitespace-nowrap">UPI</span>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-gray-700 font-semibold whitespace-nowrap">Google Pay</span>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-gray-700 font-semibold whitespace-nowrap">PhonePe</span>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-gray-700 font-semibold whitespace-nowrap">Cards</span>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-gray-700 font-semibold whitespace-nowrap">NetBanking</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-red-600 bg-red-50/30 ring-1 ring-red-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-red-600 focus:ring-red-500 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-neutral-700 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed break-words">
                        Pay with cash or UPI directly when your package arrives at your doorstep.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3.5 sm:py-4 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span className="truncate">Processing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {paymentMethod === "razorpay"
                        ? `Pay ${formatPrice(finalTotal)} via Razorpay`
                        : `Place COD Order (${formatPrice(finalTotal)})`}
                    </span>
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500 text-center">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Truck className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Express Dispatch in 24 Hrs
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 7-Day Easy Exchange
                </span>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5 w-full min-w-0">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs lg:sticky lg:top-24 space-y-5 sm:space-y-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <span>Order Summary ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span className="text-xs font-normal text-gray-500">Includes all taxes</span>
              </h2>

              {/* Item List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                      {item.image?.url && (
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                      <span className="absolute top-0.5 right-0.5 bg-black/80 text-white text-[10px] font-bold px-1.5 rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">{item.variantTitle}</p>
                      {item.discountBadge && (
                        <span className="inline-block text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mt-1">
                          {item.discountBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-gray-900">
                        {formatPrice(parseFloat(item.price.amount) * item.quantity)}
                      </div>
                      {item.compareAtPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatPrice(parseFloat(item.compareAtPrice.amount) * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mytipe Coins Redemption */}
              {user && userCoins > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 sm:p-3.5">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-amber-950 truncate">
                          Redeem Mytipe Coins ({userCoins} Available)
                        </div>
                        <div className="text-[10px] text-amber-800">
                          1 Coin = ₹1 instant discount! Save up to ₹{maxUsableCoins}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplyCoins((prev) => !prev)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0 self-end xs:self-auto ${
                        applyCoins
                          ? "bg-amber-600 text-white"
                          : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
                      }`}
                    >
                      {applyCoins ? "Applied ✓" : "Apply Coins"}
                    </button>
                  </div>
                </div>
              )}

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Discount code (e.g. WELCOME10)"
                    className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-black uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" /> {couponSuccess}
                  </p>
                )}
              </form>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                {tierDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Milestone Order Discount ({tierDiscount === 200 ? "₹200 OFF" : "₹100 OFF"})</span>
                    </span>
                    <span className="font-bold">-{formatPrice(tierDiscount)}</span>
                  </div>
                )}

                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Bundle & MRP Savings</span>
                    <span className="font-semibold">-{formatPrice(totalSavings)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                {coinsDiscountAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>Mytipe Coins ({coinsDiscountAmount} pts)</span>
                    <span className="font-semibold">-{formatPrice(coinsDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 items-center">
                  <span>Shipping & Delivery</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[11px]">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                <div className="flex justify-between text-sm font-extrabold text-gray-950 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-base text-red-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Free shipping banner if remaining */}
              {!isCheckoutUnlocked && (
                <div className="p-2.5 rounded-lg bg-orange-50 text-[11px] text-orange-800 text-center font-medium">
                  Add {formatPrice(CART_MILESTONES.UNLOCK_CHECKOUT - subtotal)} more to qualify for <strong>FREE Delivery</strong>!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
