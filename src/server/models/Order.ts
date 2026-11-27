import mongoose, { Schema, Model } from "mongoose";
import { Order } from "@/types/store";

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const CartLineItemSchema = new Schema(
  {
    id: { type: String, required: true },
    variantId: { type: String, required: true },
    productId: { type: String, required: true },
    handle: { type: String, required: true },
    title: { type: String, required: true },
    variantTitle: { type: String, required: true },
    price: {
      amount: { type: String, required: true },
      currencyCode: { type: String, default: "INR" },
    },
    image: {
      url: { type: String, required: true },
      altText: { type: String },
    },
    quantity: { type: Number, required: true, default: 1 },
    discountBadge: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: ShippingAddressSchema, required: true },
    items: { type: [CartLineItemSchema], required: true },
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      coinDiscount: { type: Number, default: 0 },
      shippingFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: "INR" },
    },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    razorpay: {
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
    },
    shiprocket: {
      orderId: { type: Number },
      shipmentId: { type: Number },
      awbCode: { type: String },
      courierName: { type: String },
      status: { type: String },
      trackingUrl: { type: String },
      syncedAt: { type: String },
      error: { type: String },
    },
    estimatedDelivery: { type: String },
  },
  {
    timestamps: true,
  }
);

export const OrderModel: Model<Order> =
  mongoose.models?.Order || mongoose.model<Order>("Order", OrderSchema);
