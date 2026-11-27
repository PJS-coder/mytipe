import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "";

export const isRazorpayConfigured = Boolean(key_id && key_secret);

let razorpayInstance: Razorpay | null = null;

if (isRazorpayConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
  } catch (err) {
    console.error("Failed to initialize Razorpay:", err);
  }
}

export interface CreateRazorpayOrderParams {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({
  amountInRupees,
  receipt,
  notes = {},
}: CreateRazorpayOrderParams): Promise<{
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  isMock?: boolean;
}> {
  // Amount in Paise (e.g. ₹999 -> 99900 paise)
  const amountInPaise = Math.round(amountInRupees * 100);

  if (razorpayInstance && isRazorpayConfigured) {
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes,
    });

    return {
      id: order.id,
      amount: typeof order.amount === "number" ? order.amount : amountInPaise,
      currency: order.currency || "INR",
      receipt: order.receipt || receipt,
      isMock: false,
    };
  }

  // Fallback for test/dev environments without keys configured
  if (process.env.NODE_ENV === "production") {
    throw new Error("Razorpay credentials are not configured in production environment.");
  }

  const mockOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    id: mockOrderId,
    amount: amountInPaise,
    currency: "INR",
    receipt,
    isMock: true,
  };
}

export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!isRazorpayConfigured) {
    // Only allow mock signature bypass in development, NEVER in production
    if (process.env.NODE_ENV !== "production" && signature === "mock_signature_approved") {
      return true;
    }
    return false;
  }

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "utf-8");
    const expBuf = Buffer.from(expectedSignature, "utf-8");

    if (sigBuf.length !== expBuf.length || sigBuf.length === 0) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch (err) {
    console.error("Razorpay signature verification failed:", err);
    return false;
  }
}

export function getPublicRazorpayKey(): string {
  return key_id || "rzp_test_mock_mytipe";
}
