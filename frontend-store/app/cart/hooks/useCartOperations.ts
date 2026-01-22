/**
 * Cart Operations Hook
 * Manages cart state and operations with performance optimizations
 */

import { useCallback, useMemo } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import type { Discount } from '../types';

export function useCartOperations() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        discountedTotal,
        suggestions,
        isLoadingSuggestions,
        isUpdatingCart,
    } = useCart();

    // Memoized cart operations to prevent unnecessary re-renders
    const handleRemoveItem = useCallback(
        (itemId: string | number, size?: string) => {
            removeFromCart(String(itemId), size || '');
        },
        [removeFromCart]
    );

    const handleUpdateQuantity = useCallback(
        async (itemId: string | number, size: string, quantity: number) => {
            await updateQuantity(String(itemId), size, quantity);
        },
        [updateQuantity]
    );

    const handleApplyDiscount = useCallback(
        async (code: string) => {
            await applyDiscount(code);
        },
        [applyDiscount]
    );

    const handleRemoveDiscount = useCallback(() => {
        removeDiscount();
    }, [removeDiscount]);

    // Memoized computed values
    const hasItems = useMemo(() => items.length > 0, [items.length]);

    const cartSummary = useMemo(
        () => ({
            subtotal: totalPrice,
            discount: appliedDiscount ? totalPrice - discountedTotal : 0,
            total: discountedTotal,
            itemCount: totalItems,
        }),
        [totalPrice, discountedTotal, totalItems, appliedDiscount]
    );

    return {
        items,
        hasItems,
        cartSummary,
        suggestions,
        isLoadingSuggestions,
        appliedDiscount,
        handleRemoveItem,
        handleUpdateQuantity,
        handleApplyDiscount,
        handleRemoveDiscount,
        isUpdatingCart,
    };
}
