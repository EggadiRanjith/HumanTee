/**
 * Media Domain Store
 * Manages product images with TEMP/ACTIVE lifecycle
 * 
 * CRITICAL LIFECYCLE:
 * 1. Upload → status: 'TEMP', expiresAt set
 * 2. Publish → Promote to 'ACTIVE', clear expiresAt
 * 3. Cancel/Delete → Cleanup TEMP images
 * 4. Server-side: TEMP images expire after 24h (TTL + cron job)
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { ProductImage } from '../core/product.types';

interface MediaState {
    // Data
    images: Map<string, ProductImage>;
    order: string[]; // UUID order for display
    primaryImageId?: string;

    // Dirty tracking
    isDirty: boolean;

    // Actions
    addImage: (data: { url: string; file?: File; altText: string; status: 'TEMP' | 'ACTIVE' }) => void;
    updateImage: (id: string, updates: Partial<ProductImage>) => void;
    updateImageAltText: (id: string, altText: string) => void;
    deleteImage: (id: string) => void;
    reorderImages: (newOrder: string[]) => void;
    setPrimaryImage: (id: string) => void;
    promoteAllToActive: () => void; // Called on publish
    cleanupTempImages: () => void; // Called on cancel
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    images: new Map<string, ProductImage>(),
    order: [],
    primaryImageId: undefined,
    isDirty: false,
};

export const useMediaStore = create<MediaState>()(
    immer((set, get) => ({
        ...initialState,

        addImage: (data) => {
            const id = uuidv4();
            const now = new Date();
            const expiresAt = data.status === 'TEMP'
                ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
                : undefined;

            const image: ProductImage = {
                id,
                url: data.url,
                file: data.file,
                altText: data.altText,
                status: data.status,
                expiresAt,
                uploadedAt: now,
            };

            set((state) => {
                state.images.set(id, image);
                state.order.push(id);

                // Set as primary if first image
                if (state.images.size === 1) {
                    state.primaryImageId = id;
                }

                state.isDirty = true;
            });
        },

        updateImage: (id, updates) =>
            set((state) => {
                const image = state.images.get(id);
                if (!image) return;

                state.images.set(id, { ...image, ...updates });
                state.isDirty = true;
            }),

        updateImageAltText: (id, altText) =>
            set((state) => {
                const image = state.images.get(id);
                if (!image) return;

                state.images.set(id, { ...image, altText });
                state.isDirty = true;
            }),

        deleteImage: (id) =>
            set((state) => {
                state.images.delete(id);
                state.order = state.order.filter((imageId) => imageId !== id);

                // Update primary if deleted
                if (state.primaryImageId === id) {
                    state.primaryImageId = state.order[0];
                }

                state.isDirty = true;
            }),

        reorderImages: (newOrder) =>
            set((state) => {
                state.order = newOrder;
                state.isDirty = true;
            }),

        setPrimaryImage: (id) =>
            set((state) => {
                if (state.images.has(id)) {
                    state.primaryImageId = id;
                    state.isDirty = true;
                }
            }),

        promoteAllToActive: () =>
            set((state) => {
                state.images.forEach((image, id) => {
                    if (image.status === 'TEMP') {
                        state.images.set(id, {
                            ...image,
                            status: 'ACTIVE',
                            expiresAt: undefined,
                        });
                    }
                });
            }),

        cleanupTempImages: () =>
            set((state) => {
                const tempIds: string[] = [];
                state.images.forEach((image, id) => {
                    if (image.status === 'TEMP') {
                        tempIds.push(id);
                    }
                });

                tempIds.forEach((id) => {
                    state.images.delete(id);
                    state.order = state.order.filter((imageId) => imageId !== id);
                });

                // Update primary if needed
                if (state.primaryImageId && !state.images.has(state.primaryImageId)) {
                    state.primaryImageId = state.order[0];
                }
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
