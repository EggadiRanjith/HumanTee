/**
 * Organization Domain Store
 * Manages product status, featured flag, and collections
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ProductStatus } from '../core/product.types';

interface OrganizationState {
    // Data
    status: ProductStatus;
    isFeatured: boolean;
    collections: string[];

    // Dirty tracking
    isDirty: boolean;

    // Actions
    setStatus: (status: ProductStatus) => void;
    setFeatured: (featured: boolean) => void;
    setCollections: (collections: string[]) => void;
    addCollection: (collection: string) => void;
    removeCollection: (collection: string) => void;
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    status: 'DRAFT' as ProductStatus,
    isFeatured: false,
    collections: [],
    isDirty: false,
};

export const useOrganizationStore = create<OrganizationState>()(
    immer((set) => ({
        ...initialState,

        setStatus: (status) =>
            set((state) => {
                state.status = status;
                state.isDirty = true;
            }),

        setFeatured: (featured) =>
            set((state) => {
                state.isFeatured = featured;
                state.isDirty = true;
            }),

        setCollections: (collections) =>
            set((state) => {
                state.collections = collections;
                state.isDirty = true;
            }),

        addCollection: (collection) =>
            set((state) => {
                if (!state.collections.includes(collection)) {
                    state.collections.push(collection);
                    state.isDirty = true;
                }
            }),

        removeCollection: (collection) =>
            set((state) => {
                state.collections = state.collections.filter((c) => c !== collection);
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
