/**
 * Media Domain Store (REDESIGNED)
 * Simple array-based structure for product images
 * 
 * LIFECYCLE:
 * 1. Upload → status: 'TEMP', expiresAt set
 * 2. Publish → Promote to 'ACTIVE', clear expiresAt
 * 3. Cancel/Delete → Cleanup TEMP images
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface MediaImage {
    id: string;
    url: string;
    cloudinaryUrl?: string;
    cloudinaryPublicId?: string;
    file?: File;
    altText: string;
    status: 'TEMP' | 'ACTIVE';
    isPrimary: boolean;
    order: number;
    expiresAt?: Date;
    uploadedAt: Date;
    uploadProgress?: number;
    uploadError?: string;
}

interface MediaState {
    images: MediaImage[];
    isDirty: boolean;

    // Actions
    addImage: (data: { id?: string; url: string; cloudinaryUrl?: string; file?: File; altText: string }) => void;
    updateImage: (id: string, updates: Partial<MediaImage>) => void;
    deleteImage: (id: string) => void;
    reorderImages: (newOrder: string[]) => void;
    setPrimaryImage: (id: string) => void;
    promoteAllToActive: () => void;
    cleanupTempImages: () => void;
    setImages: (images: MediaImage[]) => void; // Called on load
    markClean: () => void;
    markDirty: () => void;
    reset: () => void;
}

const initialState = {
    images: [] as MediaImage[],
    isDirty: false,
};

export const useMediaStore = create<MediaState>()((set) => ({
    ...initialState,

    addImage: (data) => {
        const id = data.id || uuidv4(); // Use provided ID or generate new one
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

        set((state) => {
            const newImage: MediaImage = {
                id,
                url: data.cloudinaryUrl || data.url, // Prefer cloudinaryUrl
                cloudinaryUrl: data.cloudinaryUrl,
                file: data.file,
                altText: data.altText,
                status: 'TEMP',
                isPrimary: state.images.length === 0,
                order: state.images.length,
                expiresAt,
                uploadedAt: now,
            };

            // Safety check: ensure state.images is an array
            const currentImages = Array.isArray(state.images) ? state.images : [];

            return {
                images: [...currentImages, newImage],
                isDirty: true,
            };
        });
    },

    updateImage: (id, updates) => {
        set((state) => {
            const currentImages = Array.isArray(state.images) ? state.images : [];
            return {
                images: currentImages.map((img) =>
                    img.id === id ? { ...img, ...updates } : img
                ),
                isDirty: true,
            };
        });
    },

    deleteImage: (id) => {
        set((state) => {
            const currentImages = Array.isArray(state.images) ? state.images : [];
            const filtered = currentImages.filter((img) => img.id !== id);

            // Reorder remaining images
            const reordered = filtered.map((img, index) => ({
                ...img,
                order: index,
                // If deleted image was primary, make first image primary
                isPrimary: currentImages.find(i => i.id === id)?.isPrimary && index === 0
                    ? true
                    : img.isPrimary && img.id !== id,
            }));

            return {
                images: reordered,
                isDirty: true,
            };
        });
    },

    reorderImages: (newOrder) => {
        set((state) => {
            const currentImages = Array.isArray(state.images) ? state.images : [];
            const reordered = newOrder
                .map((id) => currentImages.find((img) => img.id === id))
                .filter((img): img is MediaImage => img !== undefined)
                .map((img, index) => ({ ...img, order: index }));

            return {
                images: reordered,
                isDirty: true,
            };
        });
    },

    setPrimaryImage: (id) => {
        set((state) => {
            const currentImages = Array.isArray(state.images) ? state.images : [];
            return {
                images: currentImages.map((img) => ({
                    ...img,
                    isPrimary: img.id === id,
                })),
                isDirty: true,
            };
        });
    },

    promoteAllToActive: () => {
        set((state) => {
            const currentImages = Array.isArray(state.images) ? state.images : [];
            return {
                images: currentImages.map((img) =>
                    img.status === 'TEMP'
                        ? { ...img, status: 'ACTIVE' as const, expiresAt: undefined }
                        : img
                ),
            };
        });
    },

    cleanupTempImages: () => {
        set((state) => {
            const currentImages = Array.isArray(state.images) ? state.images : [];
            return {
                images: currentImages.filter((img) => img.status === 'ACTIVE'),
            };
        });
    },

    setImages: (images) => {
        set({ images, isDirty: false });
    },

    markClean: () => {
        set({ isDirty: false });
    },

    markDirty: () => {
        set({ isDirty: true });
    },

    reset: () => set(initialState),
}));
