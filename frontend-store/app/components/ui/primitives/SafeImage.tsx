/**
 * SafeImage Component
 * Universal image component with automatic fallback handling
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
                {/* Loading skeleton */}
                {loading && showSkeleton && (
                    <div className="absolute inset-0 animate-pulse bg-white/5 rounded-lg z-0" />
                )}

                {/* Image with fill - className goes on Image only */}
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    className={`${className} transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
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
            {/* Loading skeleton */}
            {loading && showSkeleton && (
                <div className="absolute inset-0 animate-pulse bg-white/5 rounded-lg" />
            )}

            {/* Image */}
            <Image
                src={imageSrc}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                onError={handleError}
                onLoad={handleLoadingComplete}
                {...props}
            />
        </div>
    );
}
