import mongoose, { Schema, Model } from "mongoose";
import { Product } from "@/types/store";

const MoneySchema = new Schema(
  {
    amount: { type: String, required: true },
    currencyCode: { type: String, default: "INR" },
  },
  { _id: false }
);

const ProductImageSchema = new Schema(
  {
    id: { type: String },
    url: { type: String, required: true },
    altText: { type: String },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    sku: { type: String },
    availableForSale: { type: Boolean, default: true },
    selectedOptions: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    price: { type: MoneySchema, required: true },
    compareAtPrice: { type: MoneySchema, default: null },
    image: { type: ProductImageSchema },
  },
  { _id: false }
);

const ProductSchema = new Schema<Product>(
  {
    id: { type: String, required: true, unique: true },
    handle: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, default: "" },
    descriptionHtml: { type: String, default: "" },
    availableForSale: { type: Boolean, default: true, index: true },
    priceRange: {
      minVariantPrice: { type: MoneySchema, required: true },
      maxVariantPrice: { type: MoneySchema, required: true },
    },
    compareAtPriceRange: {
      minVariantPrice: { type: MoneySchema },
      maxVariantPrice: { type: MoneySchema },
    },
    featuredImage: { type: ProductImageSchema, required: true },
    images: { type: [ProductImageSchema], default: [] },
    options: [
      {
        id: { type: String },
        name: { type: String },
        values: [{ type: String }],
      },
    ],
    variants: { type: [ProductVariantSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    collections: { type: [String], default: [], index: true },
    rating: {
      average: { type: Number, default: 4.9 },
      count: { type: Number, default: 120 },
    },
    highlights: { type: [String], default: [] },
    faq: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation in dev mode
export const ProductModel: Model<Product> =
  mongoose.models?.Product || mongoose.model<Product>("Product", ProductSchema);
