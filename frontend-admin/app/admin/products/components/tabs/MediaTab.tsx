'use client';

import FormSection from '../FormSection';
import { useMediaStore } from '@/domains/product/media/media.store';
import ImageUploader from '../ImageUploader';
import { useEffect, useMemo, useCallback } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';
import type { ProductImage } from '@/types/product-form.types';

export default function MediaTab() {
    const { images, addImage, updateImage, deleteImage, reorderImages, setPrimaryImage } = useMediaStore();

    // Autosave
    useEffect(() => {
        triggerAutosave('current-user-id');
    }, [images]);

    // Convert store format → uploader format
    const imagesArray = useMemo<ProductImage[]>(() => {
        // Safety check: ensure images is an array
        if (!Array.isArray(images)) {
            return [];
        }

        return images.map((img) => ({
            id: img.id,
            url: img.url,
            file: img.file,
            altText: img.altText,
            isPrimary: img.isPrimary,
            order: img.order,
        }));
    }, [images]);

    // Handle changes from ImageUploader
    const handleImagesChange = useCallback(
        (updatedImages: ProductImage[]) => {
            const currentImages = Array.isArray(images) ? images : [];
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
                    // New image - pass the ID from ImageUploader
                    addImage({
                        id: img.id,
                        url: img.url,
                        file: img.file,
                        altText: img.altText,
                    });
                } else {
                    // Update existing image
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
        <div className="space-y-6 sm:space-y-8">
            <FormSection title="Product Images">
                <div className="space-y-4 sm:space-y-5">
                    {/* Stats - Better Alignment */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm font-medium text-blue-900">Total Images</span>
                                <p className="text-2xl font-bold text-blue-700 mt-1">{images.length} / 10</p>
                            </div>
                            {primaryImage && (
                                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

                    {/* Info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs sm:text-sm text-gray-600">
                            Images are uploaded as TEMP and promoted to ACTIVE on publish.
                        </p>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
