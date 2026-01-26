/**
 * Orders Skeleton - PROFESSIONAL QUALITY
 * Matches exact layout with shimmer animation
 * Mobile: Cards | Desktop: Table
 */

export function OrdersSkeleton() {
    return (
        <div className="space-y-3 md:space-y-4 lg:space-y-6">
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
                    <div className="h-4 md:h-5 w-48 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-9 md:h-10 w-28 md:w-36 bg-gray-200 rounded-lg shimmer"></div>
            </div>

            {/* Filters Bar Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-2.5 md:p-3 lg:p-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    <div className="h-9 md:h-10 bg-gray-200 rounded-lg shimmer"></div>
                    <div className="h-9 md:h-10 bg-gray-200 rounded-lg shimmer"></div>
                    <div className="h-9 md:h-10 bg-gray-200 rounded-lg shimmer"></div>
                </div>
            </div>

            {/* Mobile Cards Skeleton */}
            <div className="lg:hidden space-y-2.5 md:space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm"
                    >
                        {/* Top section */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="space-y-2">
                                <div className="h-4 w-28 bg-gray-300 rounded shimmer"></div>
                                <div className="h-4 w-36 bg-gray-200 rounded shimmer"></div>
                                <div className="h-3 w-32 bg-gray-200 rounded shimmer"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-6 w-24 bg-yellow-200 opacity-40 rounded shimmer"></div>
                                <div className="h-6 w-24 bg-green-200 opacity-40 rounded shimmer"></div>
                            </div>
                        </div>
                        {/* Bottom section */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <div className="space-y-1">
                                <div className="h-4 w-20 bg-gray-300 rounded shimmer"></div>
                                <div className="h-3 w-16 bg-gray-200 rounded shimmer"></div>
                            </div>
                            <div className="h-3 w-20 bg-gray-200 rounded shimmer"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table Skeleton */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Table header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                    <div className="grid grid-cols-7 gap-4">
                        {['Order', 'Customer', 'Order Status', 'Payment Status', 'Total', 'Date', 'Actions'].map((_, idx) => (
                            <div key={idx} className="h-4 bg-gray-200 rounded shimmer"></div>
                        ))}
                    </div>
                </div>
                {/* Table rows */}
                <div className="divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="px-6 py-4">
                            <div className="grid grid-cols-7 gap-4 items-center">
                                {/* Order number */}
                                <div className="h-4 w-24 bg-gray-300 rounded shimmer"></div>
                                {/* Customer */}
                                <div className="space-y-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded shimmer"></div>
                                    <div className="h-3 w-28 bg-gray-200 rounded shimmer"></div>
                                </div>
                                {/* Order status badge */}
                                <div className="h-6 w-20 bg-blue-200 opacity-40 rounded shimmer"></div>
                                {/* Payment status */}
                                <div className="space-y-1">
                                    <div className="h-6 w-20 bg-green-200 opacity-40 rounded shimmer"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded shimmer"></div>
                                </div>
                                {/* Total */}
                                <div className="space-y-1">
                                    <div className="h-4 w-20 bg-gray-300 rounded shimmer"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded shimmer"></div>
                                </div>
                                {/* Date */}
                                <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
                                {/* Actions */}
                                <div className="h-4 w-12 bg-gray-300 rounded shimmer"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
