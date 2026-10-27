import { NextRequest, NextResponse } from "next/server";
import { getProductByHandle, getRelatedProducts } from "@/server/db/products";

interface RouteProps {
  params: Promise<{ handle: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { handle } = await params;
    const product = getProductByHandle(handle);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product with handle '${handle}' not found` },
        { status: 404 }
      );
    }

    const related = getRelatedProducts(handle, 4);

    return NextResponse.json({
      success: true,
      product,
      relatedProducts: related,
    });
  } catch (error) {
    console.error("GET /api/products/[handle] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
