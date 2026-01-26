/**
 * Products List Skeleton - PROFESSIONAL QUALITY
 * Matches exact layout with shim animation
 * Shows product cards grid
 */

export function ProductsSkeleton() {
    return (
        <div className="space-y-3 md:space-y-4">
            {/* Shimmer effect CSS */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                .shimmer {
                    animation: shimmer 2s infinite;
                    background: linear-gradient(
                        to right,
                        #f0f0f0 0%,
                        #f8f8f8 20%,
                        #f0f0f0 40%,
                        #f0f0f0 100%
                    );
                    background-size: 1000px 100%;
                }
            `}</style>

            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-8 md:h-9 lg:h-10 w-32 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-4 md:h-5 w-56 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-9 md:h-10 w-32 md:w-40 bg-black opacity-10 rounded-lg shimmer"></div>
            </div>

            {/* Filters Bar Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
                <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg shimmer"></div>
                    <div className="w-32 h-10 bg-gray-200 rounded-lg shimmer"></div>
                </div>
            </div>

            {/* Product Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Image placeholder */}
                        <div className="aspect-square bg-gray-200 shimmer"></div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Title */}
                            <div className="h-5 bg-gray-300 rounded shimmer"></div>

                            {/* Category badge */}
                            <div className="h-6 w-20 bg-blue-200 opacity-40 rounded shimmer"></div>

                            {/* Price and stock */}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <div className="space-y-1">
                                    <div className="h-5 w-20 bg-gray-300 rounded shimmer"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded shimmer"></div>
                                </div>
                                <div className="h-6 w-16 bg-green-200 opacity-40 rounded shimmer"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
