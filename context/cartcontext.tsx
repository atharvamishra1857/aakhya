"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { fbTrack } from "@/lib/fbpixel";

// ================= TYPES =================

export type VariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: { name: string; value: string }[];
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  handle: string;
  variantTitle?: string;
  selectedOptions?: { name: string; value: string }[];
  availableVariants?: VariantNode[];
};

export type CartDiscount = {
  label: string;
  amount: number; // fixed rupee amount
};

// ================= CONTEXT TYPE =================

type CartContextType = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateVariant: (oldId: string, newVariant: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  // cartSubtotal = sum of items at full price (before any discount)
  cartSubtotal: number;
  // cartTotal = what the customer actually pays (subtotal − discount)
  cartTotal: number;
  cartCount: number;
  discount: CartDiscount | null;
  applyDiscount: (discount: CartDiscount) => void;
  clearDiscount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY     = "aakhya_cart";
const DISCOUNT_STORAGE_KEY = "aakhya_discount";

// ================= PROVIDER =================

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [discount, setDiscount] = useState<CartDiscount | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem(DISCOUNT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const openCart  = useCallback(() => setIsOpen(true),  []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // ── AUTOMATIC CART CLEARING ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const isOrderConfirmed = url.pathname.includes("order-confirmed");
    const hasPaymentId     = url.searchParams.has("paymentId") || url.searchParams.has("txnid");
    const hasClearFlag     = url.searchParams.get("clear_cart") === "true";

    if (hasClearFlag || (isOrderConfirmed && hasPaymentId)) {
      setCartItems([]);
      setDiscount(null);
      sessionStorage.removeItem(CART_STORAGE_KEY);
      sessionStorage.removeItem(DISCOUNT_STORAGE_KEY);

      url.searchParams.delete("clear_cart");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // ── CART OPERATIONS ──────────────────────────────────────────────────────
  const addToCart = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);

    fbTrack("AddToCart", {
      content_ids:  [newItem.id],
      content_name:  newItem.title,
      content_type: "product",
      value:         newItem.price,
      currency:     "INR",
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      }),
    );
  }, []);

  const updateVariant = useCallback((oldId: string, newVariant: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const oldItem = prevItems.find((item) => item.id === oldId);
      if (!oldItem) return prevItems;

      const quantityToMove = oldItem.quantity;
      const withoutOld     = prevItems.filter((item) => item.id !== oldId);

      const existingNewItem = withoutOld.find((item) => item.id === newVariant.id);
      if (existingNewItem) {
        return withoutOld.map((item) =>
          item.id === newVariant.id
            ? { ...item, quantity: item.quantity + quantityToMove }
            : item,
        );
      }

      return [...withoutOld, { ...newVariant, quantity: quantityToMove }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setDiscount(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CART_STORAGE_KEY);
      sessionStorage.removeItem(DISCOUNT_STORAGE_KEY);
    }
  }, []);

  // ── DISCOUNT OPERATIONS ──────────────────────────────────────────────────
  const applyDiscount = useCallback((d: CartDiscount) => {
    setDiscount(d);
  }, []);

  const clearDiscount = useCallback(() => {
    setDiscount(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(DISCOUNT_STORAGE_KEY);
    }
  }, []);

  // ── PERSISTENCE ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Cart save failed:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (discount) {
        sessionStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify(discount));
      } else {
        sessionStorage.removeItem(DISCOUNT_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Discount save failed:", error);
    }
  }, [discount]);

  // ── DERIVED TOTALS ───────────────────────────────────────────────────────
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // cartTotal is what gets charged — never below zero
  const cartTotal = Math.max(0, cartSubtotal - (discount?.amount ?? 0));

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // ── CONTEXT VALUE ────────────────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      isOpen,
      openCart,
      closeCart,
      cartItems,
      addToCart,
      updateQuantity,
      updateVariant,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartTotal,
      cartCount,
      discount,
      applyDiscount,
      clearDiscount,
    }),
    [
      isOpen,
      openCart,
      closeCart,
      cartItems,
      addToCart,
      updateQuantity,
      updateVariant,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartTotal,
      cartCount,
      discount,
      applyDiscount,
      clearDiscount,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}