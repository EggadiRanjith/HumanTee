/**
 * Media Tab (REFACTORED - Domain Store Version)
 * Uses useMediaStore with TEMP/ACTIVE lifecycle
 */

'use client';

import FormSection from '../FormSection';
import { useMediaStore } from '@/domains/product/media/media.store';
import ImageUploader from '../ImageUploader';
import { useEffect, useMemo, useCallback } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';
import type { ProductImage } from '@/types/product-form.types';

export default function MediaTab() {
    const { images, order, primaryImageId, addImage, deleteImage, setPrimaryImage, updateImageAltText, reorderImages } = useMediaStore();

    // Trigger autosave
    useEffect(() => {
        triggerAutosave('current-user-id');
    }, [images, order, primaryImageId]);

    // Convert Map to Array for ImageUploader component
    const imagesArray = useMemo((): ProductImage[] => {
        const result: ProductImage[] = [];

        order.forEach((id, index) => {
            const img = images.get(id);
            if (img) {
                result.push({
                    id: img.id,
                    url: img.url,
                    file: img.file,
                    altText: img.altText,
                    isPrimary: img.id === primaryImageId,
                    order: index,
                });
            }
        });

        return result;
    }, [images, order, primaryImageId]);

    // Handle changes from ImageUploader
    const handleImagesChange = useCallback((updatedImages: ProductImage[]) => {
        // Get fresh state from store to avoid closure issues
        const currentState = useMediaStore.getState();
        const currentImages = currentState.images;
        const currentOrder = currentState.order;
        const currentPrimaryId = currentState.primaryImageId;

        // Clear existing images and add new ones in order
        const currentIds = new Set(currentOrder);
        const newIds = new Set(updatedImages.map(img => img.id));

        // Delete removed images
        currentIds.forEach(id => {
            if (!newIds.has(id)) {
                deleteImage(id);
            }
        });

        // Add or update images
        updatedImages.forEach((img) => {
            const existingImage = currentImages.get(img.id);

            if (!existingImage) {
                // New image
                addImage({
                    url: img.url,
                    file: img.file,
                    altText: img.altText,
                    status: 'TEMP',
                });
            } else {
                // Update existing
                if (img.altText !== existingImage.altText) {
                    updateImageAltText(img.id, img.altText);
                }
            }

            // Set primary if needed
            if (img.isPrimary && img.id !== currentPrimaryId) {
                setPrimaryImage(img.id);
            }
        });

        // Update order
        const newOrder = updatedImages.map(img => img.id);
        if (JSON.stringify(newOrder) !== JSON.stringify(currentOrder)) {
            reorderImages(newOrder);
        }
    }, [addImage, deleteImage, setPrimaryImage, updateImageAltText, reorderImages]);

    return (
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Product Images">
                <div className="space-y-4">
                    {/* Image Stats */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-900">Total Images</span>
                            <span className="text-lg font-bold text-blue-700">{images.size} / 10</span>
                        </div>
                        {primaryImageId && (
                            <p className="text-xs text-blue-700 mt-2">
                                ✓ Primary image set
                            </p>
                        )}
                    </div>

                    {/* Image Uploader */}
                    <ImageUploader
                        images={imagesArray}
                        onChange={handleImagesChange}
                        maxImages={10}
                    />

                    {/* Lifecycle Info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-600">
                            💡 <strong>Note:</strong> Images are uploaded as TEMP status and will be promoted to ACTIVE when you publish the product.
                            Unpublished images are automatically cleaned up after 24 hours.
                        </p>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
