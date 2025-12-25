/**
 * Cart Skeleton Loader
 * Mobile-first skeleton loader for cart items
 */

import React from 'react';

interface CartSkeletonProps {
    count?: number;
}

export function CartSkeleton({ count = 3 }: CartSkeletonProps) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="p-4 sm:p-6 rounded-2xl luxury-glass border border-white/10 bg-white/5 animate-pulse"
                >
                    {/* Mobile: Stack layout, Desktop: Row layout */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Image skeleton */}
                        <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl bg-white/10" />

                        {/* Content skeleton */}
                        <div className="flex-1 space-y-3">
                            {/* Title */}
                            <div className="h-5 bg-white/10 rounded w-3/4" />

                            {/* Details */}
                            <div className="h-4 bg-white/10 rounded w-1/2" />

                            {/* Price and quantity */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="h-6 bg-white/10 rounded w-20" />
                                <div className="h-10 bg-white/10 rounded w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
