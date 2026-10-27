export interface CoinTransaction {
  id: string;
  amount: number;
  type: "spin_reward" | "welcome_bonus" | "referral" | "redeem_discount";
  description: string;
  timestamp: string;
}

export interface WonCoupon {
  code: string;
  label: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  wonAt: string;
  expiresAt: string; // 1 hour validity
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  coins: number;
  createdAt: string;
  hasClaimedWelcomeSpin: boolean;
  spinCount: number;
  activeCoupon?: WonCoupon;
  transactions: CoinTransaction[];
}

export interface WheelSlice {
  id: number;
  label: string;
  sublabel?: string;
  couponCode?: string;
  discountType?: "percentage" | "flat";
  discountValue?: number;
  coins: number;
  color: string;
  textColor: string;
  isWinningEligible: boolean;
  weight: number;
}

