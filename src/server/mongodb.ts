import mongoose from "mongoose";

const rawUri = process.env.MONGODB_URI || "";
export const MONGODB_URI = rawUri.endsWith(".mongodb.net/") || rawUri.endsWith(".mongodb.net")
  ? rawUri.replace(/\.mongodb\.net\/?$/, ".mongodb.net/mytipe?retryWrites=true&w=majority")
  : rawUri;

export const isMongoConfigured = Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache__: MongooseCache | undefined;
}

if (!global.__mongoose_cache__) {
  global.__mongoose_cache__ = { conn: null, promise: null };
}

const cached = global.__mongoose_cache__;

export async function connectToMongoDB(): Promise<typeof mongoose | null> {
  if (!isMongoConfigured) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("Connected to MongoDB successfully!");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection failed:", e);
    throw e;
  }

  return cached.conn;
}
