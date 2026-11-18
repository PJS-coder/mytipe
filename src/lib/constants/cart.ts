export const CART_MILESTONES = {
  UNLOCK_CHECKOUT: 399, // ₹399 Unlocks Checkout & Free Express Shipping
  DISCOUNT_100: 999,    // ₹999 unlocks ₹100 Instant Order Discount
  DISCOUNT_200: 1499,   // ₹1,499 unlocks ₹200 Instant Order Discount
} as const;

export function calculateCartMilestones(subtotal: number) {
  const T1 = CART_MILESTONES.UNLOCK_CHECKOUT;
  const T2 = CART_MILESTONES.DISCOUNT_100;
  const T3 = CART_MILESTONES.DISCOUNT_200;

  const isCheckoutUnlocked = subtotal >= T1;
  const isDiscount100Unlocked = subtotal >= T2;
  const isDiscount200Unlocked = subtotal >= T3;

  let tierDiscount = 0;
  if (subtotal >= T3) {
    tierDiscount = 200;
  } else if (subtotal >= T2) {
    tierDiscount = 100;
  }

  // Calculate percentage fill across the 3 segments (0 -> 33.33% -> 66.66% -> 100%)
  let fillPercentage = 0;
  if (subtotal <= 0) {
    fillPercentage = 0;
  } else if (subtotal < T1) {
    fillPercentage = (subtotal / T1) * 33.33;
  } else if (subtotal < T2) {
    fillPercentage = 33.33 + ((subtotal - T1) / (T2 - T1)) * 33.33;
  } else if (subtotal < T3) {
    fillPercentage = 66.66 + ((subtotal - T2) / (T3 - T2)) * 33.34;
  } else {
    fillPercentage = 100;
  }
  fillPercentage = Math.min(100, Math.max(0, fillPercentage));

  let message = "";
  if (!isCheckoutUnlocked) {
    const diff = (T1 - subtotal).toFixed(2);
    message = `You are Rs. ${diff} away from Unlock Checkout`;
  } else if (!isDiscount100Unlocked) {
    const diff = (T2 - subtotal).toFixed(2);
    message = `You are Rs. ${diff} away from Order discount`;
  } else if (!isDiscount200Unlocked) {
    const diff = (T3 - subtotal).toFixed(2);
    message = `You are Rs. ${diff} away from Order discount`;
  } else {
    message = `🎉 Maximum discount of ₹200 OFF applied to your order!`;
  }

  return {
    T1,
    T2,
    T3,
    isCheckoutUnlocked,
    isDiscount100Unlocked,
    isDiscount200Unlocked,
    tierDiscount,
    fillPercentage,
    message,
    shippingFee: subtotal >= T1 ? 0 : 50,
  };
}
