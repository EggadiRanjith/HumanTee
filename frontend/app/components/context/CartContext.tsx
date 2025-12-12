"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

export interface CartItem {
  id: number | string;
  title: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  size?: string;
  variantId?: string;
  availableStock?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }, onSuccess?: () => void, onError?: (message: string) => void) => Promise<boolean>;
  removeFromCart: (id: number | string, size?: string) => void;
  updateQuantity: (id: number | string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getItemInCart: (id: number | string, size?: string) => CartItem | undefined;
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

  const addToCart = async (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    onSuccess?: () => void,
    onError?: (message: string) => void
  ): Promise<boolean> => {
    const qtyToAdd = item.quantity || 1;
    const { quantity: _, ...itemWithoutQty } = item;

    // Stock validation
    if (item.availableStock !== undefined && qtyToAdd > item.availableStock) {
      const errorMsg = `Only ${item.availableStock} items available`;
      onError?.(errorMsg);
      return false;
    }

    // Check for existing item
    const existing = items.find((i) => i.id === item.id && i.size === item.size);

    if (existing) {
      // Check total quantity doesn't exceed stock
      const totalQty = existing.quantity + qtyToAdd;
      if (item.availableStock !== undefined && totalQty > item.availableStock) {
        const remaining = item.availableStock - existing.quantity;
        const errorMsg = `You already have ${existing.quantity} in cart. Only ${remaining} more available.`;
        onError?.(errorMsg);
        return false;
      }
    }

    // Add to cart
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + qtyToAdd }
            : i
        );
      }
      return [...prev, { ...itemWithoutQty, quantity: qtyToAdd }];
    });

    onSuccess?.();
    return true;
  };

  const removeFromCart = (id: number | string, size?: string) => {
    setItems((prev) => prev.filter((item) =>
      !(item.id === id && (!size || item.size === size))
    ));
  };

  const updateQuantity = (id: number | string, size: string, quantity: number) => {
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
    return sum + item.price * item.quantity;
  }, 0);

  const getItemInCart = (id: number | string, size?: string) => {
    return items.find((i) => i.id === id && (!size || i.size === size));
  };

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
        getItemInCart,
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
