import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const api_key = process.env.CLOUDINARY_API_KEY || "";
const api_secret = process.env.CLOUDINARY_API_SECRET || "";

export const isCloudinaryConfigured = Boolean(cloud_name && api_key && api_secret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId?: string;
  source: "cloudinary" | "local_fallback";
}

/**
 * Uploads a validated file buffer to Cloudinary (or local fallback if credentials aren't set yet)
 */
export async function uploadImage(
  buffer: Buffer,
  originalFilename?: string,
  mimeType?: string
): Promise<UploadResult> {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "mytipe_products",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload failed:", error);
            reject(error || new Error("Failed to upload image to Cloudinary"));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              source: "cloudinary",
            });
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Graceful Local Fallback: saves file to public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Determine safe extension based on mimeType
  let ext = ".jpg";
  if (mimeType === "image/png" || originalFilename?.endsWith(".png")) ext = ".png";
  else if (mimeType === "image/webp" || originalFilename?.endsWith(".webp")) ext = ".webp";
  else if (mimeType === "image/avif" || originalFilename?.endsWith(".avif")) ext = ".avif";

  const randomHash = crypto.randomBytes(8).toString("hex");
  const safeFilename = `${Date.now()}-${randomHash}${ext}`;
  const filePath = path.join(uploadsDir, safeFilename);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${safeFilename}`,
    source: "local_fallback",
  };
}
