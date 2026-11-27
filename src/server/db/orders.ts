import { Order, ShippingAddress, CartLineItem, PaymentMethod } from "@/types/store";
import { connectToMongoDB, isMongoConfigured } from "@/server/mongodb";
import { OrderModel } from "@/server/models/Order";

// Global cache to persist orders across module reloads in Node/Vercel
declare global {
  // eslint-disable-next-line no-var
  var __mytipe_orders__: Map<string, Order> | undefined;
}

if (!global.__mytipe_orders__) {
  global.__mytipe_orders__ = new Map<string, Order>();
}

const ordersMap = global.__mytipe_orders__;

export interface CreateOrderInput {
  customer: ShippingAddress;
  items: CartLineItem[];
  pricing: {
    subtotal: number;
    discount: number;
    coinDiscount: number;
    shippingFee: number;
    tax: number;
    total: number;
    currency: string;
  };
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
}

export function createOrder(input: CreateOrderInput): Order {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderId = `MT-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-3)}`;
  const orderNumber = `MT#${randomSuffix}`;

  // Calculate 3-5 days delivery estimate
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const order: Order = {
    id: orderId,
    orderNumber,
    customer: input.customer,
    items: input.items,
    pricing: input.pricing,
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
    orderStatus: "placed",
    razorpay: input.razorpayOrderId ? { orderId: input.razorpayOrderId } : undefined,
    createdAt: new Date().toISOString(),
    estimatedDelivery,
  };

  ordersMap.set(orderId, order);

  // Sync to MongoDB if configured
  if (isMongoConfigured) {
    connectToMongoDB()
      .then(() => OrderModel.create(order))
      .catch((err) => console.error("MongoDB order create sync error:", err));
  }

  return order;
}

export function getOrderById(orderId: string): Order | undefined {
  return ordersMap.get(orderId);
}

export async function getOrderByIdAsync(orderId: string): Promise<Order | undefined> {
  const cached = ordersMap.get(orderId);
  if (cached) return cached;

  if (isMongoConfigured) {
    try {
      await connectToMongoDB();
      const doc = await OrderModel.findOne({ id: orderId }).lean();
      if (doc) {
        const order = doc as unknown as Order;
        ordersMap.set(orderId, order);
        return order;
      }
    } catch (err) {
      console.error("MongoDB getOrderByIdAsync error:", err);
    }
  }

  return undefined;
}

export function updateOrderPayment(
  orderId: string,
  paymentDetails: { razorpayPaymentId: string; razorpaySignature: string }
): Order | undefined {
  const order = ordersMap.get(orderId);
  if (!order) return undefined;

  order.paymentStatus = "paid";
  order.orderStatus = "processing";
  order.razorpay = {
    ...order.razorpay,
    paymentId: paymentDetails.razorpayPaymentId,
    signature: paymentDetails.razorpaySignature,
  };

  ordersMap.set(orderId, order);

  // Sync update to MongoDB
  if (isMongoConfigured) {
    connectToMongoDB()
      .then(() =>
        OrderModel.findOneAndUpdate(
          { id: orderId },
          {
            paymentStatus: "paid",
            orderStatus: "processing",
            razorpay: order.razorpay,
          }
        )
      )
      .catch((err) => console.error("MongoDB order payment sync error:", err));
  }

  return order;
}

export function getAllOrders(): Order[] {
  return Array.from(ordersMap.values()).reverse();
}
