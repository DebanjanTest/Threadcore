"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { CartItem } from "./types";
import { GST_RATE } from "./catalog-data";

interface CouponResult {
  success: boolean;
  message: string;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Calculations
  subtotalPaise: number;
  discountPercent: number;
  discountPaise: number;
  couponCode: string;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  freeShippingThresholdPaise: number;
  amountNeededForFreeShippingPaise: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_PAISE = 99900; // ₹999
const STANDARD_SHIPPING_PAISE = 9900; // ₹99

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialization from localStorage to prevent set-state in effect
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("threadcore_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("threadcore_cart", JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if matching item exists
      const existingIndex = prev.findIndex(
        (it) =>
          it.skuId === newItem.skuId &&
          it.color.id === newItem.color.id &&
          it.size === newItem.size &&
          it.printTechnique === newItem.printTechnique &&
          it.printLocations.slice().sort().join(",") ===
            newItem.printLocations.slice().sort().join(",") &&
          it.designPreview === newItem.designPreview
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        const newQty = Math.min(50, existing.quantity + newItem.quantity);
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPaise: existing.unitPricePaise * newQty,
        };
        return next;
      }

      const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return [...prev, { ...newItem, id }];
    });

    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    const clamped = Math.min(50, quantity);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: clamped,
              totalPaise: item.unitPricePaise * clamped,
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const applyCoupon = useCallback((code: string): CouponResult => {
    const clean = code.trim().toUpperCase();
    if (clean === "TECH10") {
      setCouponCode("TECH10");
      setDiscountPercent(10);
      return { success: true, message: "10% off coupon applied!" };
    }
    if (clean === "CORE20") {
      setCouponCode("CORE20");
      setDiscountPercent(20);
      return { success: true, message: "VIP 20% discount applied!" };
    }
    if (clean === "THREAD50") {
      setCouponCode("THREAD50");
      setDiscountPercent(15);
      return { success: true, message: "15% off coupon applied!" };
    }
    return { success: false, message: "Invalid promo code. Try TECH10 or CORE20" };
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setDiscountPercent(0);
  }, []);

  const cartCount = useMemo(() => {
    return items.reduce((acc, it) => acc + it.quantity, 0);
  }, [items]);

  const subtotalPaise = useMemo(() => {
    return items.reduce((acc, it) => acc + it.totalPaise, 0);
  }, [items]);

  const discountPaise = useMemo(() => {
    if (discountPercent <= 0) return 0;
    return Math.round((subtotalPaise * discountPercent) / 100);
  }, [subtotalPaise, discountPercent]);

  const discountedSubtotalPaise = subtotalPaise - discountPaise;

  const shippingPaise = useMemo(() => {
    if (items.length === 0) return 0;
    if (discountedSubtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) return 0;
    return STANDARD_SHIPPING_PAISE;
  }, [items.length, discountedSubtotalPaise]);

  const taxPaise = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round(discountedSubtotalPaise * GST_RATE);
  }, [items.length, discountedSubtotalPaise]);

  const totalPaise = useMemo(() => {
    if (items.length === 0) return 0;
    return discountedSubtotalPaise + shippingPaise + taxPaise;
  }, [items.length, discountedSubtotalPaise, shippingPaise, taxPaise]);

  const amountNeededForFreeShippingPaise = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - discountedSubtotalPaise);
  }, [discountedSubtotalPaise]);

  const value = useMemo(
    () => ({
      items,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotalPaise,
      discountPercent,
      discountPaise,
      couponCode,
      applyCoupon,
      removeCoupon,
      shippingPaise,
      taxPaise,
      totalPaise,
      freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
      amountNeededForFreeShippingPaise,
    }),
    [
      items,
      cartCount,
      isCartOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotalPaise,
      discountPercent,
      discountPaise,
      couponCode,
      applyCoupon,
      removeCoupon,
      shippingPaise,
      taxPaise,
      totalPaise,
      amountNeededForFreeShippingPaise,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
