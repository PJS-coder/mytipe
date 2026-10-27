"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle,
  Truck,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Banknote,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load order receipt", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Generating your order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {order?.paymentMethod === "cod" ? "Order Placed (Cash on Delivery)" : "Payment Confirmed via Razorpay"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">Thank You for Your Order!</h1>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: <strong className="text-gray-900">{order?.orderNumber || orderId || "MT#Confirmed"}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            We have received your order and our fulfillment team has begun carefully packing your therapeutic foot care package.
          </p>

          {/* Delivery Tracker Bar */}
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-3.5 rounded-xl bg-gray-50 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Est. Delivery</div>
                <div className="text-xs font-bold text-gray-900">{order?.estimatedDelivery || "3-4 Business Days"}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 flex items-start gap-3">
              <Truck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Courier Partner</div>
                <div className="text-xs font-bold text-gray-900">Bluedart / Delhivery Express</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 flex items-start gap-3">
              {order?.paymentMethod === "cod" ? (
                <Banknote className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
              ) : (
                <CreditCard className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Payment</div>
                <div className="text-xs font-bold text-gray-900">
                  {order?.paymentMethod === "cod" ? "Pay on Delivery (Cash/UPI)" : "Paid Online"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-red-600" /> Items in Your Package
            </h2>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                    {item.image?.url && (
                      <Image
                        src={item.image.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-gray-500">{item.variantTitle}</p>
                    <div className="text-[11px] text-gray-500 mt-0.5">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-900">
                      {formatPrice(parseFloat(item.price.amount) * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Info & Pricing Breakdown */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-500" /> Delivery Address
                </div>
                <div className="text-gray-600 space-y-0.5">
                  <p className="font-semibold text-gray-900">{order.customer.fullName}</p>
                  <p>{order.customer.addressLine1}</p>
                  {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}
                  <p>
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </p>
                  <p className="pt-1 text-gray-500">Phone: +91 {order.customer.phone}</p>
                </div>
              </div>

              <div className="space-y-2 bg-neutral-50 p-4 rounded-xl">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.pricing.subtotal)}</span>
                </div>
                {order.pricing.coinDiscount > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Discounts Applied</span>
                    <span className="font-semibold">-{formatPrice(order.pricing.coinDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-bold">
                    {order.pricing.shippingFee === 0 ? "FREE" : formatPrice(order.pricing.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-950 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-red-600">{formatPrice(order.pricing.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/collections/all-socks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://wa.me/919999999999?text=Hello%20Mytipe%20Team%2C%20I%20have%20an%20inquiry%20regarding%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-6 py-3.5 rounded-full text-xs font-bold transition"
          >
            <span>Need Help? Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-red-600 rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
