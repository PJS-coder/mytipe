import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/server/db/orders";
import { verifyAndCalculateOrder } from "@/server/db/pricing";
import { checkRateLimit, getClientIp } from "@/server/security/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`cod-order:${clientIp}`, {
      maxRequests: 15,
      windowSeconds: 10 * 60, // 15 orders per 10 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many order requests. Please wait a few moments before trying again.",
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

    const order = createOrder({
      customer: verifiedCustomer,
      items: verifiedItems,
      pricing,
      paymentMethod: "cod",
    });

    return NextResponse.json({
      success: true,
      message: "Cash on Delivery order placed successfully",
      order,
    });
  } catch (error) {
    console.error("POST /api/orders/cod error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place COD order" },
      { status: 500 }
    );
  }
}
