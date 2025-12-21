/**
 * Basic Info Domain Store
 * Manages product name, description, type, and category
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface BasicInfoState {
    // Data
    name: string;
    description: string;
    productType: string;
    category: string;

    // Dirty tracking
    isDirty: boolean;

    // Actions
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    setProductType: (type: string) => void;
    setCategory: (category: string) => void;
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    name: '',
    description: '',
    productType: '',
    category: '',
    isDirty: false,
};

export const useBasicInfoStore = create<BasicInfoState>()(
    immer((set) => ({
        ...initialState,

        setName: (name) =>
            set((state) => {
                state.name = name;
                state.isDirty = true;
            }),

        setDescription: (description) =>
            set((state) => {
                state.description = description;
                state.isDirty = true;
            }),

        setProductType: (type) =>
            set((state) => {
                state.productType = type;
                state.isDirty = true;
            }),

        setCategory: (category) =>
            set((state) => {
                state.category = category;
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
