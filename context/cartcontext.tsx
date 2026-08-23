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
  variantTitle?: string;                // e.g. "M / Sage"
  selectedOptions?: { name: string; value: string }[];
  availableVariants?: VariantNode[];    // full variant list from the product
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
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// 🔑 session-based storage key
const CART_STORAGE_KEY = "aakhya_cart";

// ================= PROVIDER =================

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ LOAD FROM SESSION STORAGE (runs once)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = sessionStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // ================= ADD TO CART =================
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
  }, []);

  // ================= UPDATE QUANTITY =================
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

  // ================= UPDATE VARIANT =================
  const updateVariant = useCallback((oldId: string, newVariant: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const oldItem = prevItems.find((item) => item.id === oldId);
      if (!oldItem) return prevItems;

      const quantityToMove = oldItem.quantity;
      const withoutOld = prevItems.filter((item) => item.id !== oldId);

      // If the newly selected variant is ALREADY in the cart, combine their quantities
      const existingNewItem = withoutOld.find((item) => item.id === newVariant.id);
      if (existingNewItem) {
        return withoutOld.map((item) =>
          item.id === newVariant.id
            ? { ...item, quantity: item.quantity + quantityToMove }
            : item,
        );
      }

      // Otherwise, just push the new variant with the old quantity
      return [...withoutOld, { ...newVariant, quantity: quantityToMove }];
    });
  }, []);

  // // ================= UPDATE VARIANT =================
  // const updateVariant = useCallback(
  //   (oldId: string, newVariant: Omit<CartItem, "quantity">) => {
  //     setCartItems((prevItems) => {
  //       const oldItemIndex = prevItems.findIndex((item) => item.id === oldId);
  //       if (oldItemIndex === -1) return prevItems;

  //       const oldQuantity = prevItems[oldItemIndex].quantity;
  //       const existingIndex = prevItems.findIndex((item) => item.id === newVariant.id);

  //       if (existingIndex !== -1 && existingIndex !== oldItemIndex) {
  //         const newItems = [...prevItems];
  //         newItems[existingIndex].quantity += oldQuantity;
  //         newItems.splice(oldItemIndex, 1);
  //         return newItems;
  //       } else {
  //         const newItems = [...prevItems];
  //         newItems[oldItemIndex] = { ...newVariant, quantity: oldQuantity };
  //         return newItems;
  //       }
  //     });
  //   },
  //   []
  // );

  // ================= REMOVE =================
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ================= SAVE TO SESSION STORAGE =================
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Cart save failed:", error);
    }
  }, [cartItems]);

  // ================= DERIVED VALUES =================
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

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
      cartTotal,
      cartCount,
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
      cartTotal,
      cartCount,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

// ================= HOOK =================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}