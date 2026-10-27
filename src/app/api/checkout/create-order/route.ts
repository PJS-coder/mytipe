import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder, getPublicRazorpayKey, isRazorpayConfigured } from "@/server/razorpay";
import { createOrder } from "@/server/db/orders";
import { CartLineItem, ShippingAddress } from "@/types/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, coinDiscount = 0 } = body as {
      customer: ShippingAddress;
      items: CartLineItem[];
      coinDiscount?: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    if (!customer?.fullName || !customer?.phone || !customer?.addressLine1 || !customer?.pincode) {
      return NextResponse.json({ success: false, error: "Please fill all required shipping fields" }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);

    // Free shipping above ₹449
    const shippingFee = subtotal >= 449 ? 0 : 50;

    // Apply coin discount
    const validCoinDiscount = Math.min(Math.max(0, coinDiscount), subtotal);
    const total = Math.max(0, subtotal - validCoinDiscount + shippingFee);

    // 1. Create Razorpay Order
    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;
    const rzpOrder = await createRazorpayOrder({
      amountInRupees: total,
      receipt,
      notes: {
        customerName: customer.fullName,
        customerPhone: customer.phone,
        itemsCount: items.length.toString(),
      },
    });

    // 2. Create pending internal order
    const order = createOrder({
      customer,
      items,
      pricing: {
        subtotal: Math.round(subtotal),
        discount: 0,
        coinDiscount: validCoinDiscount,
        shippingFee,
        tax: 0,
        total: Math.round(total),
        currency: "INR",
      },
      paymentMethod: "razorpay",
      razorpayOrderId: rzpOrder.id,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount, // in paise
      currency: rzpOrder.currency,
      key: getPublicRazorpayKey(),
      isRazorpayConfigured,
      isMock: rzpOrder.isMock,
    });
  } catch (error) {
    console.error("POST /api/checkout/create-order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout order" },
      { status: 500 }
    );
  }
}
