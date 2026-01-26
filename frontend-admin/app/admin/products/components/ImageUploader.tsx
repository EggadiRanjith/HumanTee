import { useState, useCallback, useEffect } from 'react';
import { ProductImage } from '@/types/product-form.types';
import ImagePreviewCard from './ImagePreviewCard';
import { uploadImageToCloudinary } from '@/lib/api/uploadToCloudinary';

interface ImageUploaderProps {
    images: ProductImage[];
    onChange: (images: ProductImage[]) => void;
    maxImages?: number;
}

export default function ImageUploader({
    images,
    onChange,
    maxImages = 10,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [localImages, setLocalImages] = useState<ProductImage[]>(images);

    // Sync local state with prop changes - PRESERVE cloudinaryUrl!
    useEffect(() => {
        // Merge incoming props with local state to preserve cloudinaryUrl
        setLocalImages(prev => {
            // Create a map of local images with their cloudinaryUrl
            const localCloudinaryUrls = new Map(
                prev.map(img => [img.id, { cloudinaryUrl: img.cloudinaryUrl, url: img.url }])
            );

            // Merge: use prop data but preserve cloudinaryUrl from local if available
            return images.map(img => {
                const local = localCloudinaryUrls.get(img.id);
                if (local?.cloudinaryUrl && !img.cloudinaryUrl) {
                    // Local has cloudinaryUrl that prop doesn't - preserve it!
                    return {
                        ...img,
                        cloudinaryUrl: local.cloudinaryUrl,
                        url: local.cloudinaryUrl, // Also use cloudinaryUrl as url
                    };
                }
                return img;
            });
        });
    }, [images]);

    const handleFileSelect = useCallback(
        async (files: FileList | null) => {
            if (!files) return;

            const remainingSlots = maxImages - images.length;
            const filesToProcess = Array.from(files).slice(0, remainingSlots);

            // Create preview images immediately (base64) - NO UPLOAD YET
            const previewPromises = filesToProcess.map((file, index) => {
                return new Promise<ProductImage>((resolve) => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e: any) => {
                            resolve({
                                id: `temp-${Date.now()}-${index}`,
                                url: e.target?.result as string, // Base64 for preview ONLY
                                file, // Keep file for later upload
                                altText: file.name.replace(/\.[^/.]+$/, ''),
                                isPrimary: images.length === 0 && index === 0,
                                order: images.length + index,
                                // NO uploadProgress - upload happens on Save
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                });
            });

            const newImages = await Promise.all(previewPromises);

            // Add images with base64 preview immediately (for UX)
            //  Cloudinary upload will happen when user clicks Save
            onChange([...images, ...newImages]);
        },
        [images, maxImages, onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDelete = useCallback(
        (id: string) => {
            const updatedImages = images.filter((img) => img.id !== id);
            // If deleted image was primary, make first image primary
            if (updatedImages.length > 0 && !updatedImages.some((img) => img.isPrimary)) {
                updatedImages[0].isPrimary = true;
            }
            onChange(updatedImages);
        },
        [images, onChange]
    );

    const handleSetPrimary = useCallback(
        (id: string) => {
            const updatedImages = images.map((img) => ({
                ...img,
                isPrimary: img.id === id,
            }));
            onChange(updatedImages);
        },
        [images, onChange]
    );

    const handleUpdateAltText = useCallback(
        (id: string, altText: string) => {
            const updatedImages = images.map((img) =>
                img.id === id ? { ...img, altText } : img
            );
            onChange(updatedImages);
        },
        [images, onChange]
    );

    const handleReorder = useCallback(
        (fromIndex: number, toIndex: number) => {
            const updatedImages = [...images];
            const [movedImage] = updatedImages.splice(fromIndex, 1);
            updatedImages.splice(toIndex, 0, movedImage);

            // Update order property
            updatedImages.forEach((img, index) => {
                img.order = index;
            });

            onChange(updatedImages);
        },
        [images, onChange]
    );

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {images.length < maxImages && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging
                            ? 'border-black bg-gray-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }
          `}
                >
                    <div className="space-y-3">
                        <div className="text-4xl">📸</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Drop images here or click to upload
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 10MB ({images.length}/{maxImages} images)
                            </p>
                        </div>
                        <label className="inline-block">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e: any) => handleFileSelect(e.target.files)}
                                className="hidden"
                            />
                            <span className="inline-block bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer">
                                Choose Files
                            </span>
                        </label>
                    </div>
                </div>
            )}

            {/* Image Grid */}
            {localImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {localImages.map((image, index) => (
                        <ImagePreviewCard
                            key={image.id}
                            image={image}
                            index={index}
                            onDelete={handleDelete}
                            onSetPrimary={handleSetPrimary}
                            onUpdateAltText={handleUpdateAltText}
                            onReorder={handleReorder}
                            totalImages={localImages.length}
                        />
                    ))}
                </div>
            )}

            {localImages.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    No images uploaded yet
                </p>
            )}
        </div>
    );
}
