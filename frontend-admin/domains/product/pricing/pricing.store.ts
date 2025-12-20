/**
 * Pricing Domain Store
 * Manages price, cost, compare-at price, and tax settings
 * NOTE: Profit and profit margin are NEVER stored - always calculated via selectors
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PricingState {
    // Data
    price: number;
    compareAtPrice?: number;
    costPerItem?: number;
    currency: string;
    taxable: boolean;

    // Dirty tracking
    isDirty: boolean;

    // Actions
    setPrice: (price: number) => void;
    setCompareAtPrice: (price: number | undefined) => void;
    setCostPerItem: (cost: number | undefined) => void;
    setCurrency: (currency: string) => void;
    setTaxable: (taxable: boolean) => void;
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    price: 0,
    compareAtPrice: undefined,
    costPerItem: undefined,
    currency: 'INR',
    taxable: true,
    isDirty: false,
};

export const usePricingStore = create<PricingState>()(
    immer((set) => ({
        ...initialState,

        setPrice: (price) =>
            set((state) => {
                state.price = price;
                state.isDirty = true;
            }),

        setCompareAtPrice: (price) =>
            set((state) => {
                state.compareAtPrice = price;
                state.isDirty = true;
            }),

        setCostPerItem: (cost) =>
            set((state) => {
                state.costPerItem = cost;
                state.isDirty = true;
            }),

        setCurrency: (currency) =>
            set((state) => {
                state.currency = currency;
                state.isDirty = true;
            }),

        setTaxable: (taxable) =>
            set((state) => {
                state.taxable = taxable;
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
