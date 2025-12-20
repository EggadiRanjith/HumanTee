/**
 * Variants Domain Store
 * UUID-based variant management with SKU locking
 * 
 * CRITICAL: Uses Map<string, Variant> + order array for performance
 * This enables:
 * - No array index bugs
 * - Safe reordering
 * - Memoization works correctly
 * - Undo/redo possible
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { Variant } from '../core/product.types';
import { generateSKU } from './sku.generator';

interface VariantsState {
    // Data
    enabled: boolean;
    variants: Map<string, Variant>;
    order: string[]; // UUID order for display

    // Dirty tracking
    isDirty: boolean;

    // Actions
    setEnabled: (enabled: boolean) => void;
    addVariant: (variant: Omit<Variant, 'id' | 'sku' | 'skuLocked'>, productName: string) => void;
    updateVariant: (id: string, updates: Partial<Variant>) => void;
    deleteVariant: (id: string) => void;
    reorderVariants: (newOrder: string[]) => void;
    generateVariantSKU: (id: string, productName: string) => void;
    lockAllSKUs: () => void; // Called on publish
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    enabled: false,
    variants: new Map<string, Variant>(),
    order: [],
    isDirty: false,
};

export const useVariantsStore = create<VariantsState>()(
    immer((set, get) => ({
        ...initialState,

        setEnabled: (enabled) =>
            set((state) => {
                state.enabled = enabled;
                state.isDirty = true;
            }),

        addVariant: (variantData, productName) => {
            const id = uuidv4();
            const sku = generateSKU(productName, variantData.size, variantData.color);

            const variant: Variant = {
                ...variantData,
                id,
                sku,
                skuLocked: false,
            };

            set((state) => {
                state.variants.set(id, variant);
                state.order.push(id);
                state.isDirty = true;
            });
        },

        updateVariant: (id, updates) =>
            set((state) => {
                const variant = state.variants.get(id);
                if (!variant) return;

                // Prevent SKU changes if locked
                if (updates.sku && variant.skuLocked) {
                    throw new Error('Cannot change SKU after product is published');
                }

                state.variants.set(id, { ...variant, ...updates });
                state.isDirty = true;
            }),

        deleteVariant: (id) =>
            set((state) => {
                state.variants.delete(id);
                state.order = state.order.filter((variantId) => variantId !== id);
                state.isDirty = true;
            }),

        reorderVariants: (newOrder) =>
            set((state) => {
                state.order = newOrder;
                state.isDirty = true;
            }),

        generateVariantSKU: (id, productName) =>
            set((state) => {
                const variant = state.variants.get(id);
                if (!variant) return;

                if (variant.skuLocked) {
                    throw new Error('Cannot regenerate SKU after product is published');
                }

                const newSKU = generateSKU(productName, variant.size, variant.color);
                state.variants.set(id, { ...variant, sku: newSKU });
                state.isDirty = true;
            }),

        lockAllSKUs: () =>
            set((state) => {
                state.variants.forEach((variant, id) => {
                    state.variants.set(id, { ...variant, skuLocked: true });
                });
            }),

        markClean: () =>
            set((state) => {
                state.isDirty = false;
            }),

        markDirty: () =>
            set((state) => {
                state.isDirty = true;
            }),

        reset: () => set(initialState),
    }))
);
