/**
 * Image Preview Card Component
 * Individual image preview with controls
 */

'use client';

import { useState } from 'react';
import { ProductImage } from '@/types/product-form.types';

interface ImagePreviewCardProps {
    image: ProductImage;
    index: number;
    onDelete: (id: string) => void;
    onSetPrimary: (id: string) => void;
    onUpdateAltText: (id: string, altText: string) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
    totalImages: number;
}

export default function ImagePreviewCard({
    image,
    index,
    onDelete,
    onSetPrimary,
    onUpdateAltText,
    onReorder,
    totalImages,
}: ImagePreviewCardProps) {
    const [isEditingAlt, setIsEditingAlt] = useState(false);
    const [altText, setAltText] = useState(image.altText);

    const handleSaveAlt = () => {
        onUpdateAltText(image.id, altText);
        setIsEditingAlt(false);
    };

    return (
        <div className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Primary Badge */}
            {image.isPrimary && (
                <div className="absolute top-2 left-2 z-10 bg-black text-white text-xs px-2 py-1 rounded font-medium">
                    Primary
                </div>
            )}

            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
                <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-full object-cover"
                />

                {/* Upload Progress Overlay */}
                {image.uploadProgress !== undefined && image.uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        <div className="w-3/4 bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-white h-full transition-all duration-300"
                                style={{ width: `${image.uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-white text-xs mt-2">{image.uploadProgress}%</p>
                    </div>
                )}

                {/* Upload Error Overlay */}
                {image.uploadError && (
                    <div className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center p-2">
                        <p className="text-white text-xs font-medium text-center">
                            {image.uploadError}
                        </p>
                        <p className="text-white/80 text-[10px] mt-1 text-center">
                            Image will use preview. Upload failed.
                        </p>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.isPrimary && (
                        <button
                            onClick={() => onSetPrimary(image.id)}
                            className="bg-white hover:bg-gray-100 text-black px-2 md:px-3 py-1 md:py-1.5 rounded text-[10px] md:text-xs font-medium transition-colors"
                            title="Set as primary"
                        >
                            Set Primary
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(image.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded text-[10px] md:text-xs font-medium transition-colors"
                        title="Delete image"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Reorder Buttons */}
            <div className="absolute top-1 md:top-2 right-1 md:right-2 z-10 flex flex-col gap-0.5 md:gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                    <button
                        onClick={() => onReorder(index, index - 1)}
                        className="bg-white hover:bg-gray-100 text-black w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[10px] md:text-xs font-bold shadow"
                        title="Move left"
                    >
                        ←
                    </button>
                )}
                {index < totalImages - 1 && (
                    <button
                        onClick={() => onReorder(index, index + 1)}
                        className="bg-white hover:bg-gray-100 text-black w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[10px] md:text-xs font-bold shadow"
                        title="Move right"
                    >
                        →
                    </button>
                )}
            </div>

            {/* Alt Text */}
            <div className="p-2 border-t border-gray-200">
                {isEditingAlt ? (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={altText}
                            onChange={(e: any) => setAltText(e.target.value)}
                            placeholder="Alt text"
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black outline-none"
                            autoFocus
                        />
                        <div className="flex gap-1">
                            <button
                                onClick={handleSaveAlt}
                                className="flex-1 bg-black text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-900"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setAltText(image.altText);
                                    setIsEditingAlt(false);
                                }}
                                className="flex-1 bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditingAlt(true)}
                        className="w-full text-left text-xs text-gray-600 hover:text-black truncate"
                        title={image.altText || 'Click to add alt text'}
                    >
                        {image.altText || 'Add alt text...'}
                    </button>
                )}
            </div>
        </div>
    );
}
