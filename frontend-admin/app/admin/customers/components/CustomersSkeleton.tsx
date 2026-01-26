/**
 * Customers Skeleton - PROFESSIONAL QUALITY
 * Matches exact layout with shimmer animation
 */

export function CustomersSkeleton() {
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
                    <div className="h-4 md:h-5 w-48 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-9 md:h-10 w-28 md:w-36 bg-gray-200 rounded-lg shimmer"></div>
            </div>

            {/* Filters Bar Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
                <div className="h-10 bg-gray-200 rounded-lg shimmer"></div>
            </div>

            {/* Customer Table/Cards Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Table header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 hidden md:block">
                    <div className="grid grid-cols-4 gap-4">
                        {['Customer', 'Email', 'Orders', 'Total Spent'].map((_, idx) => (
                            <div key={idx} className="h-4 bg-gray-200 rounded shimmer"></div>
                        ))}
                    </div>
                </div>

                {/* Table rows */}
                <div className="divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="px-4 md:px-6 py-4">
                            {/* Desktop view */}
                            <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                                <div className="space-y-1">
                                    <div className="h-4 w-32 bg-gray-300 rounded shimmer"></div>
                                </div>
                                <div className="h-4 w-40 bg-gray-200 rounded shimmer"></div>
                                <div className="h-4 w-8 bg-gray-300 rounded shimmer"></div>
                                <div className="h-4 w-20 bg-gray-300 rounded shimmer"></div>
                            </div>

                            {/* Mobile view */}
                            <div className="md:hidden space-y-2">
                                <div className="h-4 w-32 bg-gray-300 rounded shimmer"></div>
                                <div className="h-3 w-40 bg-gray-200 rounded shimmer"></div>
                                <div className="flex gap-4 pt-2 border-t border-gray-100">
                                    <div className="h-3 w-16 bg-gray-200 rounded shimmer"></div>
                                    <div className="h-3 w-20 bg-gray-200 rounded shimmer"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
