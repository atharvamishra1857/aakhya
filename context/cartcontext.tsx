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
  variantTitle?: string;
  selectedOptions?: { name: string; value: string }[];
  availableVariants?: VariantNode[];
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
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aakhya_cart";

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

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // AUTOMATIC CART CLEARING LISTENER
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("clear_cart=true")) {
      setCartItems([]);
      sessionStorage.removeItem(CART_STORAGE_KEY);
      
      // Silently clean up the URL so the user doesn't see the query string
      const url = new URL(window.location.href);
      url.searchParams.delete("clear_cart");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

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
      const withoutOld = prevItems.filter((item) => item.id !== oldId);

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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Cart save failed:", error);
    }
  }, [cartItems]);

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
      clearCart,
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
      clearCart,
      cartTotal,
      cartCount,
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