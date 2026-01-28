/**
 * Hook to handle batch image uploads with progress tracking
 * Used when saving products - uploads all pending images to Cloudinary
 */

import { useState } from 'react';
import { uploadImageToCloudinary, type UploadResult } from '@/lib/api/uploadToCloudinary';
import type { ProductImage } from '@/types/product-form.types';

export interface UploadItem {
    id: string;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

export function useImageUploads() {
    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    /**
     * Upload all images that have File objects (haven't been uploaded yet)
     * Returns updated images array with Cloudinary URLs
     */
    const uploadPendingImages = async (images: ProductImage[]): Promise<ProductImage[]> => {
        console.warn('🔍 uploadPendingImages called with:', images);
        console.warn('🔍 Image details:', images.map(img => ({ 
            id: img.id, 
            hasFile: !!img.file, 
            fileType: typeof img.file,
            hasCloudinaryUrl: !!img.cloudinaryUrl 
        })));
        
        // Find images that need uploading (have File object, no cloudinaryUrl)
        const pendingImages = images.filter(img => img.file && !img.cloudinaryUrl);
        
        console.warn('🔍 Pending images to upload:', pendingImages.length);

        if (pendingImages.length === 0) {
            console.warn('⚠️ No pending images found! All already uploaded or no File objects.');
            return images; // All images already uploaded
        }

        setIsUploading(true);

        // Initialize upload items for progress tracking
        const items: UploadItem[] = pendingImages.map(img => ({
            id: img.id,
            fileName: img.file!.name,
            progress: 0,
            status: 'pending' as const,
        }));
        setUploadItems(items);

        // Upload all images in parallel
        const uploadPromises = pendingImages.map(async (img) => {
            // Mark as uploading
            setUploadItems(prev =>
                prev.map(item =>
                    item.id === img.id ? { ...item, status: 'uploading' as const } : item
                )
            );

            try {
                const result: UploadResult = await uploadImageToCloudinary(img.file!, (progress) => {
                    // Update progress
                    setUploadItems(prev =>
                        prev.map(item =>
                            item.id === img.id ? { ...item, progress: progress.percentage } : item
                        )
                    );
                });

                // Mark as success
                setUploadItems(prev =>
                    prev.map(item =>
                        item.id === img.id
                            ? { ...item, status: 'success' as const, progress: 100 }
                            : item
                    )
                );

                return {
                    ...img,
                    url: result.url,
                    cloudinaryUrl: result.url,
                    cloudinaryPublicId: result.publicId,
                    file: undefined, // Remove file object after upload
                };
            } catch (error: any) {
                // Mark as failed
                setUploadItems(prev =>
                    prev.map(item =>
                        item.id === img.id
                            ? {
                                ...item,
                                status: 'error' as const,
                                error: error.message || 'Upload failed',
                            }
                            : item
                    )
                );

                throw error; // Re-throw to stop product save
            }
        });

        try {
            const uploadedImages = await Promise.all(uploadPromises);

            setIsUploading(false);

            // Merge uploaded images back into original array
            return images.map(img => {
                const uploaded = uploadedImages.find(u => u.id === img.id);
                return uploaded || img;
            });
        } catch (error) {
            setIsUploading(false);
            throw new Error('Failed to upload images. Please try again.');
        }
    };

    const resetUploads = () => {
        setUploadItems([]);
        setIsUploading(false);
    };

    return {
        uploadItems,
        isUploading,
        uploadPendingImages,
        resetUploads,
    };
}
