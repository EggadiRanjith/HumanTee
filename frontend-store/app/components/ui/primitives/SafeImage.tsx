/**
 * SafeImage Component
 * Universal image component with automatic fallback handling
 * Supports Cloudinary images with enhanced error handling
 */

"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type ImageType = "product" | "avatar" | "banner";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
    fallbackType?: ImageType;
    showSkeleton?: boolean;
}

const FALLBACK_IMAGES: Record<ImageType, string> = {
    product: "/images/fallbacks/product-fallback.png",
    avatar: "/images/fallbacks/avatar-fallback.png",
    banner: "/images/fallbacks/banner-fallback.png",
};

export function SafeImage({
    src,
    alt,
    fallbackType = "product",
    showSkeleton = true,
    className = "",
    fill,
    ...props
}: SafeImageProps) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleError = () => {
        console.warn(`Image failed to load: ${src}`);
        setError(true);
        setLoading(false);
    };

    const handleLoadingComplete = () => {
        setLoading(false);
    };

    // Use fallback if error occurred
    const imageSrc = error ? FALLBACK_IMAGES[fallbackType] : src;

    // If using fill, we need a wrapper with relative positioning
    if (fill) {
        return (
            <>
                {/* Loading skeleton with shimmer */}
                {loading && showSkeleton && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 z-0 overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                )}

                {/* Image with fill - className goes on Image only */}
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    unoptimized={typeof src === 'string' && src.includes('res.cloudinary.com')}
                    className={`${className} transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                    onError={handleError}
                    onLoad={handleLoadingComplete}
                    {...props}
                />
            </>
        );
    }

    // Non-fill image - standard layout
    return (
        <div className="relative inline-block">
            {/* Loading skeleton with shimmer */}
            {isLoading && showSkeleton && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            )}

            {/* Image */}
            <Image
                src={imageSrc}
                alt={alt}
                unoptimized={typeof src === 'string' && src.includes('res.cloudinary.com')}
                className={`${className} transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                onError={handleError}
                onLoad={handleLoadingComplete}
                {...props}
            />
        </div>
    );
}
