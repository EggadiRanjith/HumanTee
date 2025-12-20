/**
 * Inventory Domain Store
 * Manages stock tracking with CRITICAL mode enforcement
 * 
 * IMPORTANT: Stock can only be edited in SINGLE mode
 * In VARIANT mode, stock is read-only and derived from variants
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { InventoryMode } from '../core/product.types';

interface InventoryState {
    // Data
    mode: InventoryMode; // Derived from variants.enabled
    trackInventory: boolean;
    stock: number; // Only editable in SINGLE mode
    sku?: string;
    continueSellingWhenOutOfStock: boolean;
    lowStockThreshold?: number;

    // Dirty tracking
    isDirty: boolean;

    // Actions
    setMode: (mode: InventoryMode) => void;
    setTrackInventory: (track: boolean) => void;
    setStock: (stock: number) => void; // Throws error in VARIANT mode
    setSKU: (sku: string | undefined) => void;
    setContinueSelling: (continue_: boolean) => void;
    setLowStockThreshold: (threshold: number | undefined) => void;
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    mode: 'SINGLE' as InventoryMode,
    trackInventory: true,
    stock: 0,
    sku: undefined,
    continueSellingWhenOutOfStock: false,
    lowStockThreshold: undefined,
    isDirty: false,
};

export const useInventoryStore = create<InventoryState>()(
    immer((set, get) => ({
        ...initialState,

        setMode: (mode) =>
            set((state) => {
                state.mode = mode;
                // Don't mark dirty - mode is derived from variants
            }),

        setTrackInventory: (track) =>
            set((state) => {
                state.trackInventory = track;
                state.isDirty = true;
            }),

        setStock: (stock) => {
            const currentMode = get().mode;
            if (currentMode === 'VARIANT') {
                throw new Error('Cannot set stock in VARIANT mode. Stock is managed per-variant.');
            }
            set((state) => {
                state.stock = stock;
                state.isDirty = true;
            });
        },

        setSKU: (sku) =>
            set((state) => {
                state.sku = sku;
                state.isDirty = true;
            }),

        setContinueSelling: (continue_) =>
            set((state) => {
                state.continueSellingWhenOutOfStock = continue_;
                state.isDirty = true;
            }),

        setLowStockThreshold: (threshold) =>
            set((state) => {
                state.lowStockThreshold = threshold;
                state.isDirty = true;
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
