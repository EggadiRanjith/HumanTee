/**
 * Variants Domain Store (REDESIGNED)
 * Simple array-based structure for product variants
 * 
 * CRITICAL: SKU locking on publish to prevent inventory issues
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Variant } from '../core/product.types';
import { generateSKU } from './sku.generator';

interface VariantsState {
    // Data
    enabled: boolean;
    variants: Variant[];

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
    setVariants: (variants: Variant[]) => void; // Called on load
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    enabled: false,
    variants: [] as Variant[],
    isDirty: false,
};

export const useVariantsStore = create<VariantsState>()((set) => ({
    ...initialState,

    setEnabled: (enabled) => {
        set({ enabled, isDirty: true });
    },

    addVariant: (variant, productName) => {
        const id = uuidv4();
        const sku = generateSKU(productName, variant.size, variant.color);

        set((state) => {
            const currentVariants = Array.isArray(state.variants) ? state.variants : [];
            const newVariant: Variant = {
                ...variant,
                id,
                sku,
                skuLocked: false,
            };

            return {
                variants: [...currentVariants, newVariant],
                isDirty: true,
            };
        });
    },

    updateVariant: (id, updates) => {
        set((state) => {
            const currentVariants = Array.isArray(state.variants) ? state.variants : [];
            return {
                variants: currentVariants.map((v) =>
                    v.id === id ? { ...v, ...updates } : v
                ),
                isDirty: true,
            };
        });
    },

    deleteVariant: (id) => {
        set((state) => {
            const currentVariants = Array.isArray(state.variants) ? state.variants : [];
            return {
                variants: currentVariants.filter((v) => v.id !== id),
                isDirty: true,
            };
        });
    },

    reorderVariants: (newOrder) => {
        set((state) => {
            const currentVariants = Array.isArray(state.variants) ? state.variants : [];
            const reordered = newOrder
                .map((id) => currentVariants.find((v) => v.id === id))
                .filter((v): v is Variant => v !== undefined);

            return {
                variants: reordered,
                isDirty: true,
            };
        });
    },

    generateVariantSKU: (id, productName) => {
        set((state) => {
            const currentVariants = Array.isArray(state.variants) ? state.variants : [];
            return {
                variants: currentVariants.map((v) => {
                    if (v.id === id && !v.skuLocked) {
                        return {
                            ...v,
                            sku: generateSKU(productName, v.size, v.color),
                        };
                    }
                    return v;
                }),
                isDirty: true,
            };
        });
    },

    lockAllSKUs: () => {
        set((state) => {
            const currentVariants = Array.isArray(state.variants) ? state.variants : [];
            return {
                variants: currentVariants.map((v) => ({ ...v, skuLocked: true })),
            };
        });
    },

    setVariants: (variants) => {
        set({ variants, isDirty: false });
    },

    markClean: () => {
        set({ isDirty: false });
    },

    markDirty: () => {
        set({ isDirty: true });
    },

    reset: () => set(initialState),
}));
