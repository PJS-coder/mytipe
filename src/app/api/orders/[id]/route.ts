import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/server/db/orders";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order with ID '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
