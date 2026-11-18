"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { User, CoinTransaction, WheelSlice, WonCoupon } from "@/types/auth";

export interface OpenAuthModalOptions {
  prompt?: string;
  onSuccess?: () => void;
}

export const WHEEL_SLICES: WheelSlice[] = [
  {
    id: 0,
    label: "10 COINS",
    coins: 10,
    color: "#2b76a6", // Website Brand Blue
    textColor: "#ffffff",
    isWinningEligible: true,
    weight: 50,
  },
  {
    id: 1,
    label: "OH! ALMOST THERE",
    coins: 0,
    color: "#f1f5f9", // Cool Light Grey
    textColor: "#334155",
    isWinningEligible: false,
    weight: 0,
  },
  {
    id: 2,
    label: "20 COINS",
    coins: 20,
    color: "#94a3b8", // Slate Grey
    textColor: "#ffffff",
    isWinningEligible: true,
    weight: 35,
  },
  {
    id: 3,
    label: "50 COINS",
    coins: 50,
    color: "#1e384c", // Dark Slate Blue
    textColor: "#ffffff",
    isWinningEligible: true,
    weight: 12,
  },
  {
    id: 4,
    label: "10 COINS",
    coins: 10,
    color: "#2b76a6", // Website Brand Blue
    textColor: "#ffffff",
    isWinningEligible: true,
    weight: 50,
  },
  {
    id: 5,
    label: "TRY AGAIN",
    coins: 0,
    color: "#f1f5f9", // Cool Light Grey
    textColor: "#334155",
    isWinningEligible: false,
    weight: 0,
  },
  {
    id: 6,
    label: "100 COINS",
    coins: 100,
    color: "#0f1c3f", // Deep Navy
    textColor: "#ffffff",
    isWinningEligible: true,
    weight: 3,
  },
  {
    id: 7,
    label: "20 COINS",
    coins: 20,
    color: "#94a3b8", // Slate Grey
    textColor: "#ffffff",
    isWinningEligible: true,
    weight: 35,
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Mobile Login Functions
  loginWithPhone: (phone: string, name?: string) => User;
  login: (phoneOrEmail: string, name?: string) => void;
  quickTestLogin: () => void;
  logout: () => void;
  
  // Auth Modal Controls
  isAuthModalOpen: boolean;
  authModalPrompt?: string;
  openAuthModal: (options?: OpenAuthModalOptions | unknown) => void;
  closeAuthModal: () => void;

  // Coins Management
  addCoins: (amount: number, description: string, type?: CoinTransaction["type"]) => void;
  spendCoins: (amount: number, description: string) => boolean;
  
  // Welcome Gift Spin Wheel controls
  isSpinWheelOpen: boolean;
  openSpinWheel: () => void;
  closeSpinWheel: () => void;
  hasClaimedWelcomeSpin: boolean;
  recordSpinWin: (slice: WheelSlice) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "mytipe_auth_user_mobile_v1";
const USERS_MAP_STORAGE_KEY = "mytipe_registered_users_map_mobile_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState<string | undefined>(undefined);
  const authSuccessCallbackRef = useRef<(() => void) | null>(null);

  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.length > 10) {
      return cleaned.slice(-10);
    }
    return cleaned;
  };

  const loginWithPhone = useCallback((rawPhone: string, name?: string): User => {
    const phone = normalizePhone(rawPhone) || rawPhone.trim();
    const formattedName = name?.trim() || `User ${phone.slice(-4) || "Shopper"}`;

    let usersMap: Record<string, User> = {};
    try {
      const stored = localStorage.getItem(USERS_MAP_STORAGE_KEY);
      if (stored) usersMap = JSON.parse(stored);
    } catch {
      // ignore
    }

    let activeUser: User;
    if (usersMap[phone]) {
      activeUser = usersMap[phone];
      if (name && name.trim()) {
        activeUser.name = name.trim();
      }
    } else {
      activeUser = {
        id: `user-${Date.now()}`,
        name: formattedName,
        phone,
        email: `${phone}@mytipe.user`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(phone)}`,
        coins: 0,
        createdAt: new Date().toISOString(),
        hasClaimedWelcomeSpin: false,
        spinCount: 0,
        transactions: [],
      };
    }

    usersMap[phone] = activeUser;
    try {
      localStorage.setItem(USERS_MAP_STORAGE_KEY, JSON.stringify(usersMap));
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(activeUser));
    } catch {
      // ignore
    }

    setUser(activeUser);
    setIsAuthModalOpen(false);
    setAuthModalPrompt(undefined);

    // Execute post-login callback if registered
    const cb = authSuccessCallbackRef.current;
    authSuccessCallbackRef.current = null;
    if (cb) {
      try {
        cb();
      } catch (err) {
        console.error("Error executing auth success callback:", err);
      }
    }

    return activeUser;
  }, []);

  const login = useCallback(
    (phoneOrEmail: string, name?: string) => {
      loginWithPhone(phoneOrEmail, name);
    },
    [loginWithPhone]
  );

  const quickTestLogin = useCallback(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const mockPhone = `98765${randomSuffix}`;
    loginWithPhone(mockPhone, `Shopper ${mockPhone.slice(-4)}`);
  }, [loginWithPhone]);

  const openAuthModal = useCallback((options?: OpenAuthModalOptions | unknown) => {
    // If called directly as onClick={openAuthModal}, ignore the synthetic event object
    const isSyntheticEvent =
      options &&
      typeof options === "object" &&
      ("nativeEvent" in options || "preventDefault" in options);

    const opts = isSyntheticEvent ? undefined : (options as OpenAuthModalOptions | undefined);
    setAuthModalPrompt(opts?.prompt);
    authSuccessCallbackRef.current = opts?.onSuccess || null;
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalPrompt(undefined);
    authSuccessCallbackRef.current = null;
  }, []);

  // Check auth state from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Failed to load user state", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist user changes
  useEffect(() => {
    if (isLoading) return;
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save user to localStorage", err);
    }
  }, [user, isLoading]);

  const hasClaimedWelcomeSpin = Boolean(user && user.hasClaimedWelcomeSpin);

  const logout = useCallback(() => {
    setUser(null);
    setIsSpinWheelOpen(false);
    setIsAuthModalOpen(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const addCoins = useCallback(
    (amount: number, description: string, type: CoinTransaction["type"] = "welcome_bonus") => {
      setUser((prev) => {
        if (!prev) return prev;
        const newTransaction: CoinTransaction = {
          id: `tx-${Date.now()}`,
          amount,
          type,
          description,
          timestamp: new Date().toISOString(),
        };
        const updated: User = {
          ...prev,
          coins: prev.coins + amount,
          transactions: [newTransaction, ...prev.transactions],
        };

        try {
          const stored = localStorage.getItem(USERS_MAP_STORAGE_KEY);
          const map = stored ? JSON.parse(stored) : {};
          map[updated.phone] = updated;
          localStorage.setItem(USERS_MAP_STORAGE_KEY, JSON.stringify(map));
        } catch {
          // ignore
        }

        return updated;
      });
    },
    []
  );

  const spendCoins = useCallback(
    (amount: number, description: string): boolean => {
      if (!user || user.coins < amount) return false;
      const newTransaction: CoinTransaction = {
        id: `tx-spend-${Date.now()}`,
        amount: -amount,
        type: "redeem_discount",
        description,
        timestamp: new Date().toISOString(),
      };
      setUser((prev) => {
        if (!prev) return prev;
        const updated: User = {
          ...prev,
          coins: prev.coins - amount,
          transactions: [newTransaction, ...prev.transactions],
        };

        try {
          const stored = localStorage.getItem(USERS_MAP_STORAGE_KEY);
          const map = stored ? JSON.parse(stored) : {};
          map[updated.phone] = updated;
          localStorage.setItem(USERS_MAP_STORAGE_KEY, JSON.stringify(map));
        } catch {
          // ignore
        }

        return updated;
      });
      return true;
    },
    [user]
  );

  const recordSpinWin = useCallback((slice: WheelSlice) => {
    const coinsWon = slice.coins || 10;
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

    const wonCoupon: WonCoupon | undefined = slice.couponCode
      ? {
          code: slice.couponCode,
          label: slice.label,
          discountType: slice.discountType || "percentage",
          discountValue: slice.discountValue || 10,
          wonAt: new Date().toISOString(),
          expiresAt: expiryDate,
        }
      : undefined;

    setUser((prev) => {
      if (!prev) return prev;
      const spinTx: CoinTransaction = {
        id: `tx-spin-${Date.now()}`,
        amount: coinsWon,
        type: "spin_reward",
        description: `Fortune Wheel Won: ${slice.label} + ${coinsWon} Coins!`,
        timestamp: new Date().toISOString(),
      };
      const updated: User = {
        ...prev,
        coins: prev.coins + coinsWon,
        hasClaimedWelcomeSpin: true,
        spinCount: (prev.spinCount || 0) + 1,
        activeCoupon: wonCoupon,
        transactions: [spinTx, ...prev.transactions],
      };

      try {
        const stored = localStorage.getItem(USERS_MAP_STORAGE_KEY);
        const map = stored ? JSON.parse(stored) : {};
        map[updated.phone] = updated;
        localStorage.setItem(USERS_MAP_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // ignore
      }

      return updated;
    });
  }, []);

  const openSpinWheel = useCallback(() => {
    setIsSpinWheelOpen(true);
  }, []);

  const closeSpinWheel = useCallback(() => {
    setIsSpinWheelOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginWithPhone,
        login,
        quickTestLogin,
        logout,
        isAuthModalOpen,
        authModalPrompt,
        openAuthModal,
        closeAuthModal,
        addCoins,
        spendCoins,
        isSpinWheelOpen,
        openSpinWheel,
        closeSpinWheel,
        hasClaimedWelcomeSpin,
        recordSpinWin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

