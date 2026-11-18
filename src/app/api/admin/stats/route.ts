import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/server/db/products";
import { getAllCollections } from "@/server/db/collections";
import { getAllOrders } from "@/server/db/orders";
import { isRequestAuthorized } from "@/server/auth/admin";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const products = getAllProducts();
    const collections = getAllCollections();
    const orders = getAllOrders();

    const inStock = products.filter((p) => p.availableForSale).length;
    const outOfStock = products.length - inStock;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "cod")
      .reduce((sum, o) => sum + o.pricing.total, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: products.length,
        inStock,
        outOfStock,
        totalCollections: collections.length,
        totalOrders: orders.length,
        totalRevenue,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to load stats" }, { status: 500 });
  }
}
