/**
 * ProductDetailSkeleton Component
 * Loading placeholder for product detail page
 */

"use client";

export function ProductDetailSkeleton() {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
                {/* Main image - shimmer always shows, CSS controls speed */}
                <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Thumbnails - shimmer always shows, CSS controls speed */}
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-white/5 rounded relative overflow-hidden"
                        >
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
                {/* Title and category */}
                <div className="space-y-3">
                    <div className="h-8 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                </div>

                {/* Price */}
                <div className="h-10 bg-white/10 rounded w-32" />

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                </div>

                {/* Size selector */}
                <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded w-20" />
                    <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-10 w-10 bg-white/5 rounded" />
                        ))}
                    </div>
                </div>

                {/* Add to cart & wishlist */}
                <div className="flex gap-4">
                    <div className="h-12 bg-white/10 rounded flex-1" />
                    <div className="h-12 w-12 bg-white/10 rounded" />
                </div>

                {/* Additional info */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}
