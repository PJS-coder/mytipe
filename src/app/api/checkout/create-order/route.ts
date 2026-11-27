import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder, getPublicRazorpayKey, isRazorpayConfigured } from "@/server/razorpay";
import { createOrder } from "@/server/db/orders";
import { verifyAndCalculateOrder } from "@/server/db/pricing";
import { checkRateLimit, getClientIp } from "@/server/security/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`create-order:${clientIp}`, {
      maxRequests: 20,
      windowSeconds: 10 * 60, // 20 requests per 10 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many checkout requests. Please wait a few moments before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { customer, items, coinDiscount = 0 } = body;

    // Verify customer, items against server catalog, and calculate tamper-proof pricing
    const verification = verifyAndCalculateOrder(customer, items, coinDiscount);
    if (!verification.success) {
      return NextResponse.json({ success: false, error: verification.error }, { status: 400 });
    }

    const { customer: verifiedCustomer, items: verifiedItems, pricing } = verification.data;

    // 1. Create Razorpay Order
    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;
    const rzpOrder = await createRazorpayOrder({
      amountInRupees: pricing.total,
      receipt,
      notes: {
        customerName: verifiedCustomer.fullName,
        customerPhone: verifiedCustomer.phone,
        itemsCount: verifiedItems.length.toString(),
        tierDiscount: pricing.discount.toString(),
      },
    });

    // 2. Create pending internal order
    const order = createOrder({
      customer: verifiedCustomer,
      items: verifiedItems,
      pricing,
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
