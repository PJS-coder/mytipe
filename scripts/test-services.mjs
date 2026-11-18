import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Razorpay from "razorpay";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load .env.local
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

const results = {
  mongodb: { status: "pending", message: "" },
  cloudinary: { status: "pending", message: "" },
  razorpay: { status: "pending", message: "" },
};

async function testCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    results.cloudinary = { status: "error", message: "Missing Cloudinary credentials" };
    return;
  }

  try {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
    const pingRes = await cloudinary.api.ping();
    results.cloudinary = {
      status: "success",
      message: `Connected successfully! (status: ${pingRes.status || "ok"}, cloud: ${cloud_name})`,
    };
  } catch (err) {
    results.cloudinary = {
      status: "error",
      message: err.message || "Failed to connect to Cloudinary",
    };
  }
}

async function testMongoDB() {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    results.mongodb = { status: "error", message: "Missing MONGODB_URI" };
    return;
  }

  // Ensure database name 'mytipe' is included if ending with trailing slash
  if (uri.endsWith(".mongodb.net/") || uri.endsWith(".mongodb.net")) {
    uri = uri.replace(/\.mongodb\.net\/?$/, ".mongodb.net/mytipe?retryWrites=true&w=majority");
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    const dbName = conn.connection.name || "mytipe";
    results.mongodb = {
      status: "success",
      message: `Connected successfully! (database: ${dbName}, host: ${conn.connection.host})`,
    };
    await mongoose.disconnect();
  } catch (err) {
    results.mongodb = {
      status: "error",
      message: err.message || "Failed to connect to MongoDB",
    };
  }
}

async function testRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    results.razorpay = { status: "error", message: "Missing Razorpay credentials" };
    return;
  }

  try {
    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    // Fetch payments list with limit 1 to verify credentials
    const payments = await instance.payments.all({ count: 1 });
    results.razorpay = {
      status: "success",
      message: `Authenticated successfully! (Live key: ${key_id.slice(0, 12)}..., items accessible: ${payments.items ? "yes" : "no"})`,
    };
  } catch (err) {
    results.razorpay = {
      status: "error",
      message: err.message || "Failed to authenticate with Razorpay",
    };
  }
}

async function main() {
  await Promise.allSettled([testCloudinary(), testMongoDB(), testRazorpay()]);
  console.log(JSON.stringify(results, null, 2));
}

main();
