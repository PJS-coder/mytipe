import { NextRequest, NextResponse } from "next/server";
import { createOrder, updateOrderShiprocket } from "@/server/db/orders";
import { verifyAndCalculateOrder } from "@/server/db/pricing";
import { checkRateLimit, getClientIp } from "@/server/security/rateLimit";
import { createShiprocketOrder, isShiprocketConfigured } from "@/server/shiprocket";

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

    // Push COD order to Shiprocket automatically (non-blocking if Shiprocket fails)
    if (isShiprocketConfigured) {
      try {
        const srResult = await createShiprocketOrder(order);
        if (srResult.success) {
          updateOrderShiprocket(order.id, {
            orderId: srResult.orderId,
            shipmentId: srResult.shipmentId,
            awbCode: srResult.awbCode,
            courierName: srResult.courierName,
            status: srResult.status,
            syncedAt: new Date().toISOString(),
          });
        } else if (srResult.error) {
          updateOrderShiprocket(order.id, {
            error: srResult.error,
            syncedAt: new Date().toISOString(),
          });
        }
      } catch (srErr) {
        console.warn("Shiprocket COD auto-sync warning:", srErr);
      }
    }

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
