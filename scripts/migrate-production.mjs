import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load .env.local manually to ensure variables are present
const envPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

console.log("\n=======================================================");
console.log("🚀 MYTIPE PRODUCTION CLOUD MIGRATION SCRIPT");
console.log("=======================================================\n");

async function runMigration() {
  const urlMap = new Map();

  // 1. CLOUDINARY UPLOADS
  if (CLOUD_NAME && API_KEY && API_SECRET) {
    console.log(`[1/2] Connecting to Cloudinary (cloud: ${CLOUD_NAME})...`);
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
      secure: true,
    });

    const uploadsDir = path.join(rootDir, "public", "uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir).filter((f) => !f.startsWith("."));
      console.log(`Found ${files.length} local images in public/uploads/ to migrate...`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(uploadsDir, file);
        const localUrl = `/uploads/${file}`;

        try {
          process.stdout.write(`Uploading [${i + 1}/${files.length}] ${file}... `);
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "mytipe_products",
            resource_type: "auto",
            use_filename: true,
            unique_filename: false,
          });
          urlMap.set(localUrl, result.secure_url);
          console.log(`✓ Done -> ${result.secure_url}`);
        } catch (err) {
          console.log(`✗ Error: ${err.message}`);
        }
      }
    }

    // Also check hero images in public/ if needed
    const heroFiles = ["hero2.png", "hero3.png", "hero4.png", "heros.webp"];
    for (const hero of heroFiles) {
      const heroPath = path.join(rootDir, "public", hero);
      if (fs.existsSync(heroPath)) {
        try {
          process.stdout.write(`Uploading hero banner ${hero}... `);
          const result = await cloudinary.uploader.upload(heroPath, {
            folder: "mytipe_banners",
            resource_type: "image",
            use_filename: true,
            unique_filename: false,
          });
          urlMap.set(`/${hero}`, result.secure_url);
          console.log(`✓ Done -> ${result.secure_url}`);
        } catch (err) {
          console.log(`✗ Notice: ${err.message}`);
        }
      }
    }
  } else {
    console.log("[1/2] ⚠️ Cloudinary credentials missing in .env.local - skipping image upload.");
  }

  // Replace URLs in products.json if any were uploaded
  const productsJsonPath = path.join(rootDir, "src", "server", "data", "products.json");
  let products = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));

  if (urlMap.size > 0) {
    console.log(`\nUpdating local product images with ${urlMap.size} new Cloudinary URLs...`);
    let stringified = JSON.stringify(products, null, 2);
    for (const [localUrl, cloudUrl] of urlMap.entries()) {
      stringified = stringified.split(localUrl).join(cloudUrl);
    }
    products = JSON.parse(stringified);
    fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), "utf8");
    console.log("✓ products.json updated successfully!");
  }

  // 2. MONGODB MIGRATION
  if (MONGODB_URI && MONGODB_URI.trim()) {
    console.log("\n[2/2] Connecting to MongoDB Atlas...");
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("✓ Connected to MongoDB Atlas successfully!");

      const productSchema = new mongoose.Schema({}, { strict: false });
      const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

      console.log(`Migrating ${products.length} products to MongoDB...`);
      let updatedCount = 0;
      for (const prod of products) {
        await ProductModel.findOneAndUpdate(
          { id: prod.id },
          prod,
          { upsert: true, new: true }
        );
        updatedCount++;
      }
      console.log(`✓ Successfully synced ${updatedCount} products into MongoDB!`);

      await mongoose.disconnect();
    } catch (err) {
      console.error("✗ MongoDB migration failed:", err);
    }
  } else {
    console.log("\n[2/2] ⚠️ MONGODB_URI missing in .env.local - skipping MongoDB sync.");
  }

  console.log("\n=======================================================");
  console.log("🎉 Migration process completed!");
  console.log("=======================================================\n");
}

runMigration().catch(console.error);
