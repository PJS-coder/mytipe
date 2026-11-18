"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CartLineItem, Product, ProductVariant, ProductBundleTier } from "@/types/store";
import { calculateCartMilestones, CART_MILESTONES } from "@/lib/constants/cart";

interface CartContextType {
  items: CartLineItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
    bundleTier?: ProductBundleTier
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  subtotal: number;
  tierDiscount: number;
  finalSubtotal: number;
  isCheckoutUnlocked: boolean;
  totalSavings: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "mytipe_cart_items_v1";
const FREE_SHIPPING_THRESHOLD = CART_MILESTONES.UNLOCK_CHECKOUT;


export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (
    product: Product,
    variant: ProductVariant,
    quantity = 1,
    bundleTier?: ProductBundleTier
  ) => {
    setItems((prevItems) => {
      // Calculate effective price based on bundle if provided
      const unitPrice = bundleTier
        ? (bundleTier.totalPrice / bundleTier.pairs).toFixed(2)
        : variant.price.amount;
      
      const comparePrice = bundleTier
        ? (bundleTier.compareAtPrice / bundleTier.pairs).toFixed(2)
        : variant.compareAtPrice?.amount || (parseFloat(variant.price.amount) * 1.5).toFixed(2);

      const discountBadge = bundleTier?.badge || undefined;
      const effectiveQty = bundleTier ? bundleTier.pairs * quantity : quantity;

      const existingIndex = prevItems.findIndex(
        (item) => item.variantId === variant.id && item.bundleTierId === (bundleTier?.id || undefined)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += effectiveQty;
        return updated;
      }

      const newItem: CartLineItem = {
        id: `${variant.id}-${bundleTier?.id || "single"}-${Date.now()}`,
        variantId: variant.id,
        productId: product.id,
        handle: product.handle,
        title: product.title,
        variantTitle: variant.title,
        selectedOptions: variant.selectedOptions,
        price: {
          amount: unitPrice,
          currencyCode: variant.price.currencyCode || "INR",
        },
        compareAtPrice: {
          amount: comparePrice,
          currencyCode: variant.price.currencyCode || "INR",
        },
        image: variant.image || product.featuredImage,
        quantity: effectiveQty,
        bundleTierId: bundleTier?.id,
        discountBadge: discountBadge,
      };

      return [...prevItems, newItem];
    });

    setIsOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price.amount) || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const totalSavings = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item.compareAtPrice) return sum;
      const compare = parseFloat(item.compareAtPrice.amount) || 0;
      const current = parseFloat(item.price.amount) || 0;
      if (compare > current) {
        return sum + (compare - current) * item.quantity;
      }
      return sum;
    }, 0);
  }, [items]);

  const milestones = useMemo(() => calculateCartMilestones(subtotal), [subtotal]);
  const tierDiscount = milestones.tierDiscount;
  const isCheckoutUnlocked = milestones.isCheckoutUnlocked;
  const finalSubtotal = Math.max(0, subtotal - tierDiscount);

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalQuantity,
        subtotal,
        tierDiscount,
        finalSubtotal,
        isCheckoutUnlocked,
        totalSavings,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
