import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/server/db/orders";
import { CartLineItem, ShippingAddress } from "@/types/store";
import { calculateCartMilestones } from "@/lib/constants/cart";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, coinDiscount = 0 } = body as {
      customer: ShippingAddress;
      items: CartLineItem[];
      coinDiscount?: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    if (!customer?.fullName || !customer?.phone || !customer?.addressLine1 || !customer?.pincode) {
      return NextResponse.json({ success: false, error: "Please fill all required shipping fields" }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
    const { tierDiscount, isCheckoutUnlocked } = calculateCartMilestones(subtotal);
    const shippingFee = isCheckoutUnlocked ? 0 : 50;
    const validCoinDiscount = Math.min(Math.max(0, coinDiscount), Math.max(0, subtotal - tierDiscount));
    const total = Math.max(0, subtotal - tierDiscount - validCoinDiscount + shippingFee);

    const order = createOrder({
      customer,
      items,
      pricing: {
        subtotal: Math.round(subtotal),
        discount: tierDiscount,
        coinDiscount: validCoinDiscount,
        shippingFee,
        tax: 0,
        total: Math.round(total),
        currency: "INR",
      },
      paymentMethod: "cod",
    });

    return NextResponse.json({
      success: true,
      message: "Cash on Delivery order placed successfully",
      order,
    });
  } catch (error) {
    console.error("POST /api/orders/cod error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place COD order" },
      { status: 500 }
    );
  }
}
