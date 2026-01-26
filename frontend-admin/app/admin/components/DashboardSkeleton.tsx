/**
 * Dashboard Skeleton Loader - PROFESSIONAL QUALITY
 * Exact match of dashboard layout with polished styling
 * Uses shimmer animation for premium feel
 */

export function DashboardSkeleton() {
    return (
        <div className="space-y-4 md:space-y-6">
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
                    <div className="h-8 md:h-9 lg:h-10 w-44 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-4 md:h-5 w-36 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-9 md:h-10 w-28 md:w-36 bg-gray-200 rounded-lg shimmer"></div>
            </div>

            {/* Stats Grid - EXACT MATCH of DashboardStats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 shadow-sm"
                    >
                        {/* Label */}
                        <div className="h-3.5 sm:h-4 w-24 bg-gray-200 rounded shimmer mb-2"></div>
                        {/* Value */}
                        <div className="h-8 sm:h-9 md:h-10 w-16 bg-gray-300 rounded shimmer mb-1.5"></div>
                        {/* Subtitle */}
                        <div className="h-3 w-16 bg-gray-200 rounded shimmer"></div>
                    </div>
                ))}
            </div>

            {/* Order Status + Payment Overview - 2 column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Order Status Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-6 md:h-7 w-32 bg-gray-200 rounded shimmer mb-4"></div>
                    <div className="space-y-3">
                        {[
                            { color: 'bg-yellow-400' },
                            { color: 'bg-blue-400' },
                            { color: 'bg-purple-400' },
                            { color: 'bg-green-400' }
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color} opacity-30`}></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
                                </div>
                                <div className="h-4 w-8 bg-gray-300 rounded shimmer"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Overview Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-6 md:h-7 w-40 bg-gray-200 rounded shimmer mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="h-4 w-28 bg-gray-200 rounded shimmer"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full ${i === 1 ? 'bg-green-300' : 'bg-yellow-300'} shimmer`}
                                        style={{ width: i === 1 ? '65%' : '35%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Recent Orders - Takes 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-6 md:h-7 w-36 bg-gray-200 rounded shimmer mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-24 bg-gray-300 rounded shimmer"></div>
                                        <div className="h-3 w-16 bg-gray-200 rounded-full shimmer"></div>
                                    </div>
                                    <div className="h-3 w-40 bg-gray-200 rounded shimmer"></div>
                                </div>
                                <div className="ml-4">
                                    <div className="h-5 w-20 bg-gray-300 rounded shimmer mb-1"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded shimmer"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow lg:sticky lg:top-4">
                    <div className="h-6 md:h-7 w-32 bg-gray-200 rounded shimmer mb-4"></div>
                    <div className="space-y-3">
                        {[
                            { color: 'bg-black' },
                            { color: 'bg-blue-600' },
                            { color: 'bg-green-600' },
                            { color: 'bg-purple-600' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`h-10 w-full ${item.color} opacity-10 rounded-lg shimmer`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
