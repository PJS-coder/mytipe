import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/server/db/products";
import { isRequestAuthorized } from "@/server/auth/admin";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const products = getAllProducts();
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body?.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Product title is required" },
        { status: 400 }
      );
    }

    const newProduct = createProduct(body);
    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
