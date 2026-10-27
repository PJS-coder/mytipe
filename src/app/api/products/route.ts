import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/server/db/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const products = getAllProducts({
      collection,
      tag,
      search,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
