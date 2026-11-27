import { NextRequest, NextResponse } from "next/server";
import { uploadImage, isCloudinaryConfigured } from "@/server/cloudinary";
import { isRequestAuthorized } from "@/server/auth/admin";
import { checkRateLimit, getClientIp } from "@/server/security/rateLimit";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`admin-upload:${clientIp}`, {
    maxRequests: 30,
    windowSeconds: 10 * 60,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, error: "Too many upload requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // 1. File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 5MB limit" },
        { status: 400 }
      );
    }

    // 2. MIME type check
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, WebP, and AVIF images are permitted.",
        },
        { status: 400 }
      );
    }

    // Convert Web File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes (header validation)
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp = buffer.slice(0, 4).toString() === "RIFF" && buffer.slice(8, 12).toString() === "WEBP";
    const isAvif = buffer.slice(4, 8).toString() === "ftyp" && buffer.slice(8, 12).toString().includes("avif");

    if (!isJpeg && !isPng && !isWebp && !isAvif) {
      return NextResponse.json(
        { success: false, error: "File content does not match a valid image format" },
        { status: 400 }
      );
    }

    const result = await uploadImage(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      source: result.source,
      isCloudinaryConfigured,
      message:
        result.source === "cloudinary"
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
