import { Product } from "@/types/store";
import productsData from "@/server/data/products.json";
import fs from "fs";
import path from "path";
import { connectToMongoDB, isMongoConfigured } from "@/server/mongodb";
import { ProductModel } from "@/server/models/Product";

// Global cache to persist product changes across module reloads
declare global {
  // eslint-disable-next-line no-var
  var __mytipe_products__: Product[] | undefined;
  // eslint-disable-next-line no-var
  var __mongo_seeded__: boolean | undefined;
}

// Clean initial product list (strictly excluding any Rakhi / gift box products)
const cleanInitialProducts = (productsData as unknown as Product[]).filter(
  (p) =>
    !p.handle.toLowerCase().includes("rakhi") &&
    !p.handle.toLowerCase().includes("raksha") &&
    !p.title.toLowerCase().includes("rakhi") &&
    !p.title.toLowerCase().includes("raksha")
);

if (!global.__mytipe_products__ || global.__mytipe_products__.some(p => p.handle.includes("rakhi") || p.handle.includes("raksha"))) {
  global.__mytipe_products__ = [...cleanInitialProducts];
}

const products = global.__mytipe_products__;

// Auto-seed MongoDB on first connection & clean up obsolete Rakhi products
async function ensureMongoSeeded() {
  if (!isMongoConfigured) return;
  try {
    await connectToMongoDB();
    // Clean up any Rakhi products in MongoDB
    await ProductModel.deleteMany({
      $or: [
        { handle: { $regex: /rakhi|raksha/i } },
        { title: { $regex: /rakhi|raksha/i } },
      ],
    });

    const count = await ProductModel.countDocuments();
    if (count === 0 && products.length > 0) {
      console.log(`Auto-seeding MongoDB with ${products.length} products...`);
      await ProductModel.insertMany(products);
      console.log("MongoDB seeded successfully!");
    }
    global.__mongo_seeded__ = true;
  } catch (err) {
    console.warn("MongoDB sync notice:", err);
  }
}

// Trigger background seed check if MongoDB is configured
if (isMongoConfigured) {
  ensureMongoSeeded().catch(() => {});
}

function persistProductsToFile() {
  try {
    const dataFilePath = path.join(process.cwd(), "src", "server", "data", "products.json");
    if (fs.existsSync(path.dirname(dataFilePath))) {
      fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf8");
    }
  } catch (err) {
    // Graceful on serverless environments like Vercel with read-only lambdas
    console.warn("Notice: File persistence skipped (read-only filesystem)", err);
  }
}

export interface GetProductsOptions {
  collection?: string;
  tag?: string;
  search?: string;
  limit?: number;
}

export function getAllProducts(options?: GetProductsOptions): Product[] {
  let result = products.filter(
    (p) =>
      !p.handle.toLowerCase().includes("rakhi") &&
      !p.handle.toLowerCase().includes("raksha") &&
      !p.title.toLowerCase().includes("rakhi") &&
      !p.title.toLowerCase().includes("raksha")
  );

  if (options?.collection) {
    const col = options.collection.toLowerCase();
    result = result.filter(
      (p) =>
        p.collections?.some((c) => c.toLowerCase() === col) ||
        p.tags.some((t) => t.toLowerCase() === col) ||
        (col === "all-socks" && (p.handle.includes("sock") || p.title.toLowerCase().includes("sock")))
    );
  }

  if (options?.tag) {
    const t = options.tag.toLowerCase();
    result = result.filter((p) => p.tags.some((tag) => tag.toLowerCase() === t));
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (options?.limit && options.limit > 0) {
    result = result.slice(0, options.limit);
  }

  return result;
}

export function getProductByHandle(handle: string): Product | undefined {
  const normalized = handle.toLowerCase();
  return products.find((p) => p.handle.toLowerCase() === normalized);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(handle: string, limit = 4): Product[] {
  const current = getProductByHandle(handle);
  return products
    .filter((p) => p.handle !== handle)
    .sort((a, b) => {
      const aMatches =
        (current?.collections?.filter((c) => a.collections?.includes(c)).length || 0) +
        (current?.tags?.filter((t) => a.tags?.includes(t)).length || 0);
      const bMatches =
        (current?.collections?.filter((c) => b.collections?.includes(c)).length || 0) +
        (current?.tags?.filter((t) => b.tags?.includes(t)).length || 0);
      return bMatches - aMatches;
    })
    .slice(0, limit);
}

// Admin CRUD Operations (Dual-mode: in-memory + local file + MongoDB)
export function createProduct(input: Partial<Product> & { title: string }): Product {
  const id = input.id || `prod-${Date.now()}`;
  const baseHandle = input.handle || input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  let handle = baseHandle;
  let counter = 1;
  while (products.some((p) => p.handle === handle)) {
    handle = `${baseHandle}-${counter}`;
    counter++;
  }

  const minPrice = input.priceRange?.minVariantPrice?.amount || "499.00";
  const currencyCode = input.priceRange?.minVariantPrice?.currencyCode || "INR";

  const defaultImage = input.featuredImage || {
    url: input.images?.[0]?.url || "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
    altText: input.title,
  };

  const newProduct: Product = {
    id,
    handle,
    title: input.title,
    subtitle: input.subtitle || "Premium Daily Foot Care Essential",
    description: input.description || "",
    descriptionHtml: input.descriptionHtml || `<p>${input.description || ""}</p>`,
    availableForSale: input.availableForSale ?? true,
    priceRange: input.priceRange || {
      minVariantPrice: { amount: minPrice, currencyCode },
      maxVariantPrice: { amount: minPrice, currencyCode },
    },
    compareAtPriceRange: input.compareAtPriceRange,
    featuredImage: defaultImage,
    images: input.images && input.images.length > 0 ? input.images : [defaultImage],
    options: input.options || [
      { id: "opt-size", name: "Size", values: ["Free Size (Fits All)"] },
    ],
    variants: input.variants && input.variants.length > 0 ? input.variants : [
      {
        id: `var-${Date.now()}`,
        title: "Standard / Free Size",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "Free Size (Fits All)" }],
        price: { amount: minPrice, currencyCode },
        compareAtPrice: input.compareAtPriceRange?.minVariantPrice || null,
        image: defaultImage,
      },
    ],
    tags: input.tags || ["socks", "all-socks"],
    collections: input.collections || ["all-socks"],
    rating: input.rating || {
      average: 4.9,
      count: 142,
    },
    highlights: input.highlights || [
      "Breathable organic combed cotton for all-day comfort",
      "Ergonomic arch support reduces fatigue",
      "Reinforced heel and toe durability",
    ],
    faq: input.faq,
    banner: input.banner,
  };

  products.unshift(newProduct);
  persistProductsToFile();

  // If MongoDB configured, asynchronously sync
  if (isMongoConfigured) {
    connectToMongoDB()
      .then(() => ProductModel.create(newProduct))
      .catch((err) => console.error("MongoDB create product sync error:", err));
  }

  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];

  let updatedPriceRange = updates.priceRange || current.priceRange;
  if (updates.priceRange?.minVariantPrice) {
    updatedPriceRange = {
      minVariantPrice: updates.priceRange.minVariantPrice,
      maxVariantPrice: updates.priceRange.maxVariantPrice || updates.priceRange.minVariantPrice,
    };
  }

  const updatedProduct: Product = {
    ...current,
    ...updates,
    priceRange: updatedPriceRange,
    featuredImage: updates.featuredImage || updates.images?.[0] || current.featuredImage,
  };

  products[index] = updatedProduct;
  persistProductsToFile();

  // If MongoDB configured, asynchronously sync
  if (isMongoConfigured) {
    connectToMongoDB()
      .then(() => ProductModel.findOneAndUpdate({ id }, updatedProduct, { upsert: true }))
      .catch((err) => console.error("MongoDB update product sync error:", err));
  }

  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  persistProductsToFile();

  // If MongoDB configured, asynchronously sync
  if (isMongoConfigured) {
    connectToMongoDB()
      .then(() => ProductModel.deleteOne({ id }))
      .catch((err) => console.error("MongoDB delete product sync error:", err));
  }

  return true;
}
