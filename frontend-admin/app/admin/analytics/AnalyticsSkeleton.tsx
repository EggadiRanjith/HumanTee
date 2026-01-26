/**
 * Analytics Skeleton - PROFESSIONAL QUALITY
 * Matches dashboard layout with charts and metrics
 */

export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6 sm:space-y-8">
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

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-8 md:h-9 w-48 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-4 md:h-5 w-64 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-10 w-36 bg-gray-200 rounded-lg shimmer"></div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="h-4 w-32 bg-gray-200 rounded shimmer mb-3"></div>
                        <div className="h-8 w-24 bg-gray-300 rounded shimmer mb-2"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded shimmer"></div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-48 bg-gray-200 rounded shimmer mb-6"></div>
                <div className="h-64 bg-gray-100 rounded shimmer"></div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="h-6 w-40 bg-gray-200 rounded shimmer mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-32 bg-gray-200 rounded shimmer"></div>
                                    <div className="h-4 w-20 bg-gray-300 rounded shimmer"></div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full shimmer"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="h-6 w-40 bg-gray-200 rounded shimmer mb-4"></div>
                    <div className="h-48 bg-gray-100 rounded shimmer"></div>
                </div>
            </div>
        </div>
    );
}
