'use client';

import FormSection from '../FormSection';
import { useMediaStore } from '@/domains/product/media/media.store';
import ImageUploader from '../ImageUploader';
import { useEffect, useMemo, useCallback } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';
import type { ProductImage } from '@/types/product-form.types';

interface MediaTabProps {
    errors?: {
        images?: string;
    };
}

export default function MediaTab({ errors }: MediaTabProps) {
    const { images, addImage, updateImage, deleteImage, reorderImages, setPrimaryImage } = useMediaStore();

    // Autosave
    useEffect(() => {
        const isEditMode = typeof window !== 'undefined' && window.location.pathname.includes('/edit');
        const productId = isEditMode ? 'editing' : undefined;
        triggerAutosave('current-user-id', productId);
    }, [images]);

    // Convert store format → uploader format
    const imagesArray = useMemo<ProductImage[]>(() => {
        // Safety check: ensure images is an array
        if (!Array.isArray(images)) {
            return [];
        }

        return images.map((img) => ({
            id: img.id,
            url: img.cloudinaryUrl || img.url,
            file: img.file,
            altText: img.altText,
            isPrimary: img.isPrimary,
            order: img.order,
        }));
    }, [images]);

    // Handle changes from ImageUploader
    const handleImagesChange = useCallback(
        (updatedImages: ProductImage[] | any) => {
            // Safety check: ensure updatedImages is an array
            if (!Array.isArray(updatedImages)) {

                return;
            }


            // CRITICAL: Read DIRECTLY from store to avoid stale closure!
            // Using 'images' from closure can be stale when queueMicrotask fires
            const storeImages = useMediaStore.getState().images;
            const currentImages = Array.isArray(storeImages) ? storeImages : [];
            const currentIds = new Set(currentImages.map((i) => i.id));
            const nextIds = new Set(updatedImages.map((i) => i.id));

            // Remove deleted images
            currentIds.forEach((id) => {
                if (!nextIds.has(id)) {
                    deleteImage(id);
                }
            });

            // Add or update images
            updatedImages.forEach((img) => {
                const existing = currentImages.find((i) => i.id === img.id);

                if (!existing) {
                    // New image - pass cloudinaryUrl for proper storage
                    console.warn('🗂️ MediaTab: Adding new image to store:', {
                        id: img.id,
                        hasFile: !!img.file,
                        hasCloudinaryUrl: !!img.cloudinaryUrl,
                        url: img.url?.substring(0, 50)
                    });
                    addImage({
                        id: img.id,
                        url: img.url,
                        cloudinaryUrl: img.cloudinaryUrl,
                        file: img.file,
                        altText: img.altText,
                    });
                } else {
                    // Update existing image
                    // CRITICAL: Update cloudinaryUrl when it becomes available after upload
                    if (img.cloudinaryUrl && existing.cloudinaryUrl !== img.cloudinaryUrl) {
                        updateImage(img.id, {
                            cloudinaryUrl: img.cloudinaryUrl,
                            url: img.cloudinaryUrl,
                        });
                    }
                    if (existing.altText !== img.altText) {
                        updateImage(img.id, { altText: img.altText });
                    }
                    if (img.isPrimary !== existing.isPrimary && img.isPrimary) {
                        setPrimaryImage(img.id);
                    }
                }
            });

            // Handle reordering
            const newOrder = updatedImages.map((i) => i.id);
            const currentOrder = currentImages.map((i) => i.id);
            if (JSON.stringify(newOrder) !== JSON.stringify(currentOrder)) {
                reorderImages(newOrder);
            }
        },
        [images, addImage, updateImage, deleteImage, setPrimaryImage, reorderImages]
    );

    const primaryImage = Array.isArray(images) ? images.find((img) => img.isPrimary) : undefined;

    return (
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <FormSection title="Product Images">
                <div className="space-y-3 md:space-y-4 lg:space-y-5">
                    {/* Stats - Better Alignment - Compact Mobile */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 md:p-3 lg:p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs md:text-sm font-medium text-blue-900">Total Images</span>
                                <p className="text-xl md:text-2xl font-bold text-blue-700 mt-1">{images.length} / 10</p>
                            </div>
                            {primaryImage && (
                                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-blue-700 bg-blue-100 px-2 md:px-3 py-1.5 md:py-2 rounded-lg">
                                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Primary set</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Uploader */}
                    <ImageUploader
                        images={imagesArray}
                        onChange={handleImagesChange}
                        maxImages={10}
                    />
                    {errors?.images && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.images}
                        </p>
                    )}

                    {/* Info - Compact Mobile */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3">
                        <p className="text-xs md:text-sm text-gray-600">
                            Images are uploaded as TEMP and promoted to ACTIVE on publish.
                        </p>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
