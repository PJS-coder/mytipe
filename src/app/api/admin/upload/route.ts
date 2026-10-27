import { NextRequest, NextResponse } from "next/server";
import { uploadImage, isCloudinaryConfigured } from "@/server/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert Web File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImage(buffer, file.name);

    return NextResponse.json({
      success: true,
      url: result.url,
      source: result.source,
      isCloudinaryConfigured,
      message: result.source === "cloudinary"
        ? "Image uploaded to Cloudinary successfully!"
        : "Image saved to local storage (Add Cloudinary credentials to .env.local to upload to cloud)",
    });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
