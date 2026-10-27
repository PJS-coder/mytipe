import { NextRequest, NextResponse } from "next/server";
import { getCollectionByHandle } from "@/server/db/collections";
import { getAllProducts } from "@/server/db/products";

interface RouteProps {
  params: Promise<{ handle: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const { handle } = await params;
    const collection = getCollectionByHandle(handle);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: `Collection '${handle}' not found` },
        { status: 404 }
      );
    }

    const products = getAllProducts({ collection: handle });

    return NextResponse.json({
      success: true,
      collection,
      products,
    });
  } catch (error) {
    console.error("GET /api/collections/[handle] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
