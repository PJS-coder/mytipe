import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/server/razorpay";
import { getOrderById, updateOrderPayment } from "@/server/db/orders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body as {
      orderId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    };

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Verify cryptographic signature
    const isValid = verifyRazorpayPaymentSignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // Mark as paid
    const updatedOrder = updateOrderPayment(orderId, {
      razorpayPaymentId,
      razorpaySignature,
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("POST /api/checkout/verify error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification error" },
      { status: 500 }
    );
  }
}
