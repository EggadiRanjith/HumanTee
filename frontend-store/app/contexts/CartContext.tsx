"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import apiClient from "@/lib/api-client";
import { logError } from "@/lib/logger";
import { discountsApi, type DiscountSuggestion } from "@/lib/api/discounts";
import type { AppliedDiscount } from "@/app/types/discount.types";
import { useSettings } from "@/app/contexts/SettingsContext";

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

// Phase 2: Split contexts for render isolation
interface CartItemsContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }, onSuccess?: () => void, onError?: (message: string) => void) => Promise<boolean>;
  removeFromCart: (id: number | string, size?: string) => void;
  updateQuantity: (id: number | string, size: string, quantity: number) => void;
  clearCart: () => void;
  getItemInCart: (id: number | string, size?: string) => CartItem | undefined;
  hydrateCart: (cart: any) => void; // Phase 1: Explicit cart hydration from login
  isLoading: boolean;
  // Discount operations
  appliedDiscount: AppliedDiscount | null;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
  suggestions: DiscountSuggestion[];
  fetchSuggestions: () => Promise<void>;
  isLoadingSuggestions: boolean;
}

interface CartSummaryContextType {
  totalItems: number;
  totalPrice: number;
  discountedTotal: number;
}

const CartItemsContext = createContext<CartItemsContextType | undefined>(undefined);
const CartSummaryContext = createContext<CartSummaryContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [suggestions, setSuggestions] = useState<DiscountSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hasManuallyRemoved, setHasManuallyRemoved] = useState(false);

  // Access auth context directly to avoid circular dependency
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const authLoading = authContext?.isLoading ?? true;

  // Access settings for feature flags
  const { settings } = useSettings();

  // Phase 2: INDEPENDENT summary state (not derived!)
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);

  // PHASE 4: Cart source switch logic
  useEffect(() => {
    const initializeCart = async () => {
      if (authLoading) return;

      if (isAuthenticated) {
        // 1. Check if guest cart exists in localStorage
        const guestCartJson = localStorage.getItem("humantee-cart");

        if (guestCartJson) {
          try {
            const guestItems = JSON.parse(guestCartJson);

            if (guestItems.length > 0) {
              // 2. Merge guest cart with backend cart
              const mergePayload = {
                items: guestItems.map((item: any) => ({
                  productId: item.id.toString(),
                  variantId: item.variantId || item.id.toString(),
                  quantity: item.quantity,
                })),
              };

              await apiClient.post('/cart/merge', mergePayload);
            }
          } catch (error) {
            logError(error, 'Failed to merge guest cart');
          }
        }

        // 3. Load merged cart from backend
        await loadBackendCart();

        // 4. Clear localStorage after successful merge
        localStorage.removeItem("humantee-cart");
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
      const newItems = response.data.items.map((item: any) => ({
        cartItemId: item.id, // ← Backend cart item ID (for deletion)
        id: item.productId, // ← Product UUID (for display)
        title: item.productTitle || '',
        price: item.price,
        currency: item.currency,
        image: item.productImage || '/images/placeholder.webp',
        quantity: item.quantity,
        size: item.variantLabel,
        variantId: item.variantId,
        availableStock: item.availableStock || item.stock || item.stockQuantity,
      }));

      // Sort by cartItemId to maintain consistent order (prevents flickering)
      newItems.sort((a: any, b: any) => a.cartItemId - b.cartItemId);

      setItems(newItems);
    } catch (error) {
      logError(error, 'Failed to load cart');
      setItems([]);
    }
  };

  // Save guest cart to localStorage (keep image URLs - they're just strings)
  useEffect(() => {
    if (!isAuthenticated && !authLoading && items.length >= 0) {
      try {
        // Keep image URLs - they're small (~100 bytes each) and needed for cart display
        localStorage.setItem("humantee-cart", JSON.stringify(items));
      } catch (error) {
        // If quota exceeded, clear old cart and try again
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, clearing cart');
          localStorage.removeItem("humantee-cart");
        }
      }
    }
  }, [items, isAuthenticated, authLoading]);

  const addToCart = async (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    onSuccess?: () => void,
    onError?: (message: string) => void
  ): Promise<boolean> => {
    const quantity = item.quantity || 1;

    // Check stock before adding (both guest and authenticated)
    const existingItem = items.find(
      (i) => i.id === item.id && (!item.size || i.size === item.size)
    );

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (item.availableStock !== undefined && newQuantity > item.availableStock) {
      onError?.(`Only ${item.availableStock} items available in stock`);
      return false;
    }

    if (isAuthenticated) {
      // Backend cart with OPTIMISTIC UPDATE
      // ✅ OPTIMISTIC: Add to UI immediately
      const previousItems = [...items];

      if (existingItem) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && (!item.size || i.size === item.size)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        );
      } else {
        setItems((prev) => [...prev, { ...item, quantity } as CartItem]);
      }

      try {
        // API call in background
        await apiClient.post('/cart/items', {
          productId: item.id.toString(),
          variantId: item.variantId || item.id.toString(),
          quantity,
        });
        // Reload to ensure sync with backend (get cartItemId, etc.)
        await loadBackendCart();
        onSuccess?.();
        return true;
      } catch (error: any) {
        // ❌ ROLLBACK: Restore previous state on error
        setItems(previousItems);
        const message = error.response?.data?.message || 'Failed to add item to cart';
        onError?.(message);
        return false;
      }
    } else {
      // Guest cart (already optimistic)
      if (existingItem) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id && (!item.size || i.size === item.size)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        );
      } else {
        setItems((prev) => [...prev, { ...item, quantity } as CartItem]);
      }

      onSuccess?.();
      return true;
    }
  };

  const removeFromCart = async (id: number | string, size?: string) => {
    if (isAuthenticated) {
      // Backend cart with OPTIMISTIC UPDATE
      const item = items.find((i) => i.id === id && (!size || i.size === size));
      if (item) {
        // ✅ OPTIMISTIC: Remove from UI immediately
        const previousItems = [...items];
        setItems((prev) => prev.filter((i) => !(i.id === id && (!size || i.size === size))));

        try {
          // API call in background
          await apiClient.delete(`/cart/items/${(item as any).cartItemId}`);
          // Reload to ensure sync with backend
          await loadBackendCart();
        } catch (error) {
          // ❌ ROLLBACK: Restore previous state on error
          setItems(previousItems);
          logError(error, 'Failed to remove item');
        }
      }
    } else {
      // Guest cart (already optimistic)
      setItems((prev) => prev.filter((item) => !(item.id === id && (!size || item.size === size))));
    }
  };


  const updateQuantity = async (id: number | string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    if (isAuthenticated) {
      // Backend cart with OPTIMISTIC UPDATE
      const item = items.find((i) => i.id === id && i.size === size);
      if (item) {
        // ✅ OPTIMISTIC: Update UI immediately
        const previousItems = [...items];
        setItems((prev) =>
          prev.map((i) =>
            i.id === id && i.size === size
              ? { ...i, quantity }
              : i
          )
        );

        try {
          // API call in background - don't reload cart to avoid race conditions
          await apiClient.patch(`/cart/items/${(item as any).cartItemId}`, { quantity });
        } catch (error) {
          // ❌ ROLLBACK: Restore previous state on error
          setItems(previousItems);
          logError(error, 'Failed to update quantity');
        }
      }
    } else {
      // Guest cart (already optimistic)
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
        logError(error, 'Failed to clear cart');
      }
    } else {
      setItems([]);
      localStorage.removeItem("humantee-cart");
    }
  };

  const getItemInCart = (id: number | string, size?: string) => {
    return items.find((i) => i.id === id && (!size || i.size === size));
  };

  // Phase 1: Explicit cart hydration from login response
  const hydrateCart = (cart: any) => {
    if (!cart || !cart.items) return;

    const hydratedItems = cart.items.map((item: any) => ({
      cartItemId: item.id, // ← Backend cart item ID (for deletion)
      id: item.productId || item.id, // ← Use productId if available, fallback to id for backward compat
      title: item.productTitle || '',
      price: item.price || 0,
      currency: item.currency || 'INR',
      image: item.productImage || '/images/placeholder.webp',
      quantity: item.quantity || 1,
      size: item.variantLabel || item.size,
      variantId: item.variantId,
      availableStock: item.availableStock || item.stock || item.stockQuantity,
    }));

    setItems(hydratedItems);
  };

  // Phase 2: Update summary state when items change
  useEffect(() => {
    const newTotalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newDiscountedTotal = appliedDiscount
      ? Math.max(0, newTotalPrice - appliedDiscount.discountAmount)
      : newTotalPrice;

    setTotalItems(newTotalItems);
    setTotalPrice(newTotalPrice);
    setDiscountedTotal(newDiscountedTotal);
  }, [items, appliedDiscount]);

  // Discount functionality
  const applyDiscount = async (code: string) => {
    // ✅ Feature flag: Skip if discounts disabled
    if (!settings?.features?.discountsEnabled) {
      throw new Error('Discount codes are currently unavailable');
    }

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
      localStorage.setItem('humantee-discount', JSON.stringify(discount));
    } catch (error) {
      throw error;
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setHasManuallyRemoved(true);
    localStorage.removeItem('humantee-discount');
  };

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
      applyDiscount(appliedDiscount.code).catch(() => {
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
    // ✅ Feature flag: Skip if discounts disabled
    if (!settings?.features?.discountsEnabled) {
      setSuggestions([]);
      return;
    }

    if (items.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const suggestionsData = await discountsApi.getSuggestions({
        code: '',
        cartTotal: totalPrice,
        items: items.map(item => ({
          productId: item.id.toString(),
          variantId: item.variantId || '',
          quantity: item.quantity,
          price: item.price
        }))
      });

      setSuggestions(suggestionsData);

      if (!appliedDiscount && !hasManuallyRemoved && suggestionsData.length > 0) {
        const best = suggestionsData.find(s => s.isBest);
        if (best) {
          try {
            await applyDiscount(best.code);
          } catch (error) {
            logError(error, 'Failed to auto-apply best discount');
          }
        }
      }
    } catch (error) {
      logError(error, 'Failed to fetch suggestions');
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

  // Phase 2: Memoize context values separately
  const itemsValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemInCart,
    hydrateCart, // Phase 1: Expose hydration method
    isLoading,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    suggestions,
    fetchSuggestions,
    isLoadingSuggestions,
  }), [items, isLoading, appliedDiscount, suggestions, isLoadingSuggestions]);

  const summaryValue = useMemo(() => ({
    totalItems,
    totalPrice,
    discountedTotal,
  }), [totalItems, totalPrice, discountedTotal]);

  return (
    <CartItemsContext.Provider value={itemsValue}>
      <CartSummaryContext.Provider value={summaryValue}>
        {children}
      </CartSummaryContext.Provider>
    </CartItemsContext.Provider>
  );
}

// Phase 2: Export two hooks
export function useCartItems() {
  const context = useContext(CartItemsContext);
  if (context === undefined) {
    throw new Error("useCartItems must be used within a CartProvider");
  }
  return context;
}

export function useCartSummary() {
  const context = useContext(CartSummaryContext);
  if (context === undefined) {
    throw new Error("useCartSummary must be used within a CartProvider");
  }
  return context;
}

// Legacy hook for backward compatibility (combines both)
export function useCart() {
  return { ...useCartItems(), ...useCartSummary() };
}
