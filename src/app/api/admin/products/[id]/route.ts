import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct, getProductById } from "@/server/db/products";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const success = deleteProduct(id);

    if (!success) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
