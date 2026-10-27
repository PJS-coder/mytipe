import { NextResponse } from "next/server";
import { getAllCollections } from "@/server/db/collections";

export async function GET() {
  try {
    const collections = getAllCollections();
    return NextResponse.json({
      success: true,
      count: collections.length,
      collections,
    });
  } catch (error) {
    console.error("GET /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
