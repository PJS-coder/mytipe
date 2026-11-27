import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthorized } from "@/server/auth/admin";
import { getOrderByIdAsync, updateOrderShiprocket } from "@/server/db/orders";
import {
  createShiprocketOrder,
  isShiprocketConfigured,
  trackShiprocketShipment,
} from "@/server/shiprocket";

interface RouteProps {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/admin/orders/[id]/shiprocket
 * Push or retry pushing an order to Shiprocket from the Admin Panel.
 */
export async function POST(request: NextRequest, { params }: RouteProps) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  if (!isShiprocketConfigured) {
    return NextResponse.json(
      { success: false, error: "Shiprocket credentials are not configured in environment" },
      { status: 400 }
    );
  }

  try {
    const { id } = await params;
    const order = await getOrderByIdAsync(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const srResult = await createShiprocketOrder(order);
    if (!srResult.success) {
      updateOrderShiprocket(order.id, {
        error: srResult.error,
        syncedAt: new Date().toISOString(),
      });
      return NextResponse.json(
        { success: false, error: srResult.error || "Shiprocket sync failed" },
        { status: 502 }
      );
    }

    const updatedOrder = updateOrderShiprocket(order.id, {
      orderId: srResult.orderId,
      shipmentId: srResult.shipmentId,
      awbCode: srResult.awbCode,
      courierName: srResult.courierName,
      status: srResult.status,
      error: undefined,
      syncedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Order pushed to Shiprocket (#${srResult.orderId})`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("POST /api/admin/orders/[id]/shiprocket error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to push order to Shiprocket" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/orders/[id]/shiprocket
 * Sync live tracking / AWB status from Shiprocket for an order.
 */
export async function GET(request: NextRequest, { params }: RouteProps) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const order = await getOrderByIdAsync(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!order.shiprocket?.shipmentId && !order.shiprocket?.awbCode) {
      return NextResponse.json(
        { success: false, error: "Order has not been pushed to Shiprocket yet" },
        { status: 400 }
      );
    }

    const tracking = await trackShiprocketShipment({
      shipmentId: order.shiprocket.shipmentId,
      awbCode: order.shiprocket.awbCode,
    });

    if (!tracking.success) {
      return NextResponse.json(
        { success: false, error: tracking.error || "Unable to fetch tracking" },
        { status: 502 }
      );
    }

    const updatedOrder = updateOrderShiprocket(order.id, {
      awbCode: tracking.awbCode || order.shiprocket.awbCode,
      courierName: tracking.courierName || order.shiprocket.courierName,
      status: tracking.status || order.shiprocket.status,
      trackingUrl: tracking.trackingUrl || order.shiprocket.trackingUrl,
      error: undefined,
      syncedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("GET /api/admin/orders/[id]/shiprocket error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Shiprocket tracking" },
      { status: 500 }
    );
  }
}
