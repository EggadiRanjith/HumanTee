"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import apiClient from "@/lib/api-client";
import { discountsApi, type DiscountSuggestion } from "@/lib/api/discounts";
import type { AppliedDiscount } from "@/app/types/discount.types";

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
  subtitle?: string;
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
  isLoading: boolean;
  // Discount functionality
  appliedDiscount: AppliedDiscount | null;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
  discountedTotal: number;
  // Suggestions
  suggestions: DiscountSuggestion[];
  fetchSuggestions: () => Promise<void>;
  isLoadingSuggestions: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [suggestions, setSuggestions] = useState<DiscountSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hasManuallyRemoved, setHasManuallyRemoved] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // PHASE 4: Cart source switch logic
  useEffect(() => {
    const initializeCart = async () => {
      if (authLoading) return;

      if (isAuthenticated) {
        // Logged in → Load from backend
        await loadBackendCart();
      } else {
        // Guest → Load from localStorage
        loadLocalCart();
      }

      setIsLoading(false);
    };

    initializeCart();
  }, [isAuthenticated, authLoading]);

  // Load cart from localStorage (guest only)
  const loadLocalCart = () => {
    const savedCart = localStorage.getItem("humantee-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  // Load cart from backend (logged in only)
  const loadBackendCart = async () => {
    try {
      const response = await apiClient.get('/cart');
      setItems(response.data.items.map((item: any) => ({
        id: item.id,
        title: item.productTitle || '',
        price: item.price,
        currency: item.currency,
        image: item.productImage || '/images/placeholder.jpg', // Fallback for null images
        quantity: item.quantity,
        size: item.variantLabel, // ✅ Backend sends variantLabel, not size
        variantId: item.variantId,
      })));
    } catch (error) {
      console.error('Failed to load backend cart:', error);
      setItems([]);
    }
  };

  // Save to localStorage (guest only)
  useEffect(() => {
    if (!authLoading && !isAuthenticated && items.length >= 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("humantee-cart", JSON.stringify(items));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [items, isAuthenticated, authLoading]);

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
      const totalQty = existing.quantity + qtyToAdd;
      if (item.availableStock !== undefined && totalQty > item.availableStock) {
        const remaining = item.availableStock - existing.quantity;
        const errorMsg = `You already have ${existing.quantity} in cart. Only ${remaining} more available.`;
        onError?.(errorMsg);
        return false;
      }
    }

    if (isAuthenticated) {
      // Backend cart - only send what the DTO expects
      try {
        const response = await apiClient.post('/cart/items', {
          productId: item.id.toString(),
          variantId: item.variantId,
          quantity: qtyToAdd,
        });

        await loadBackendCart();
        onSuccess?.();
        return true;
      } catch (error: any) {
        console.error('Add to cart error:', error);
        onError?.('Failed to add to cart');
        return false;
      }
    } else {
      // Guest cart (localStorage)
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
    }
  };

  const removeFromCart = async (id: number | string, size?: string) => {
    if (isAuthenticated) {
      // Backend cart
      const item = items.find((i) => i.id === id && (!size || i.size === size));
      if (item) {
        try {
          await apiClient.delete(`/cart/items/${item.id}`);
          await loadBackendCart();
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
      }
    } else {
      // Guest cart
      setItems((prev) => prev.filter((item) =>
        !(item.id === id && (!size || item.size === size))
      ));
    }
  };

  const updateQuantity = async (id: number | string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    if (isAuthenticated) {
      // Backend cart
      const item = items.find((i) => i.id === id && i.size === size);
      if (item) {
        try {
          await apiClient.patch(`/cart/items/${item.id}`, { quantity });
          await loadBackendCart();
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      }
    } else {
      // Guest cart
      setItems((prev) =>
        prev.map((item) =>
          (item.id === id && item.size === size)
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await apiClient.delete('/cart');
        setItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setItems([]);
      localStorage.removeItem("humantee-cart");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const getItemInCart = (id: number | string, size?: string) => {
    return items.find((i) => i.id === id && (!size || i.size === size));
  };

  // Discount functionality
  const applyDiscount = async (code: string) => {
    try {
      const discount = await discountsApi.validateCode({
        code,
        cartTotal: totalPrice,
        items: items.map(item => ({
          productId: item.id.toString(),
          variantId: item.variantId || '',
          quantity: item.quantity,
          price: item.price
        }))
      });

      setAppliedDiscount(discount);
      // Persist to localStorage
      localStorage.setItem('humantee-discount', JSON.stringify(discount));
    } catch (error) {
      throw error; // Re-throw for component to handle
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    localStorage.removeItem('humantee-discount');
  };

  // Calculate discounted total
  const discountedTotal = appliedDiscount
    ? Math.max(0, totalPrice - appliedDiscount.discountAmount)
    : totalPrice;

  // Load discount from localStorage on mount
  useEffect(() => {
    const savedDiscount = localStorage.getItem('humantee-discount');
    if (savedDiscount) {
      try {
        setAppliedDiscount(JSON.parse(savedDiscount));
      } catch (e) {
        localStorage.removeItem('humantee-discount');
      }
    }
  }, []);

  // Re-validate discount when cart changes
  useEffect(() => {
    if (appliedDiscount && items.length > 0) {
      // Silently re-validate discount
      applyDiscount(appliedDiscount.code).catch(() => {
        // If validation fails, remove the discount
        removeDiscount();
      });
    }
  }, [items.length, totalPrice]);

  // Clear discount when cart is cleared
  useEffect(() => {
    if (items.length === 0 && appliedDiscount) {
      removeDiscount();
    }
  }, [items.length]);

  // Fetch discount suggestions
  const fetchSuggestions = async () => {
    if (items.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const suggestionsData = await discountsApi.getSuggestions({
        code: '', // Not needed for suggestions
        cartTotal: totalPrice,
        items: items.map(item => ({
          productId: item.id.toString(),
          variantId: item.variantId || '',
          quantity: item.quantity,
          price: item.price
        }))
      });

      setSuggestions(suggestionsData);

      // Auto-apply best discount if no discount applied and user hasn't manually removed
      if (!appliedDiscount && !hasManuallyRemoved && suggestionsData.length > 0) {
        const best = suggestionsData.find(s => s.isBest);
        if (best) {
          try {
            await applyDiscount(best.code);
          } catch (error) {
            console.error('Failed to auto-apply best discount:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Fetch suggestions when cart changes
  useEffect(() => {
    if (items.length > 0) {
      fetchSuggestions();
    }
  }, [items.length, totalPrice]);

  // Update removeDiscount to mark as manually removed
  const removeDiscountWithFlag = () => {
    setAppliedDiscount(null);
    setHasManuallyRemoved(true);
    localStorage.removeItem('humantee-discount');
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
        isLoading,
        appliedDiscount,
        applyDiscount,
        removeDiscount: removeDiscountWithFlag,
        discountedTotal,
        suggestions,
        fetchSuggestions,
        isLoadingSuggestions,
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
