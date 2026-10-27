import { NextRequest, NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings } from "@/server/db/banners";

export async function GET() {
  try {
    const settings = getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/admin/banners error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateStoreSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("POST /api/admin/banners error:", error);
    return NextResponse.json({ success: false, error: "Failed to save banners" }, { status: 500 });
  }
}
