import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdAsync } from "@/server/db/orders";
import { isRequestAuthorized } from "@/server/auth/admin";
import { checkRateLimit, getClientIp } from "@/server/security/rateLimit";
import { Order } from "@/types/store";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`get-order:${clientIp}`, {
      maxRequests: 30,
      windowSeconds: 5 * 60, // 30 requests per 5 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const { id } = await params;
    const order = await getOrderByIdAsync(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order with ID '${id}' not found` },
        { status: 404 }
      );
    }

    // Check if requester is authorized admin
    const isAdmin = isRequestAuthorized(request);

    // If not admin, mask sensitive PII to prevent IDOR data harvesting
    let safeOrder: Order = order;
    if (!isAdmin) {
      const maskedPhone = order.customer.phone
        ? `${order.customer.phone.slice(0, 2)}******${order.customer.phone.slice(-2)}`
        : "";

      safeOrder = {
        ...order,
        customer: {
          ...order.customer,
          phone: maskedPhone,
          email: order.customer.email.includes("@mytipe.user")
            ? ""
            : order.customer.email.replace(/(?<=.).(?=[^@]*?@)/g, "*"),
          addressLine1: order.customer.addressLine1 ? "*** Delivery Address ***" : "",
          addressLine2: "",
        },
      };
    }

    return NextResponse.json({
      success: true,
      order: safeOrder,
    });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
