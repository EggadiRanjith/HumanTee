"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

export interface CartItem {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("humantee-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        // Failed to load cart - start fresh
      }
    }
  }, []);

  // Debounced save to localStorage (batches writes every 500ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("humantee-cart", JSON.stringify(items));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    // We remove quantity from the item object before spreading it, to avoid issues if it was passed in "item"
    // although Omit<CartItem, "quantity"> should theoretically handle type, at runtime "item" might have it.
    // actually, item is just the argument.

    // Create the base item without the quantity property from the argument
    const { quantity: _, ...itemWithoutQty } = item;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + qtyToAdd }
            : i
        );
      }
      return [...prev, { ...itemWithoutQty, quantity: qtyToAdd }];
    });
  };

  const removeFromCart = (id: number, size?: string) => {
    setItems((prev) => prev.filter((item) =>
      !(item.id === id && (!size || item.size === size))
    ));
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        (item.id === id && item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
