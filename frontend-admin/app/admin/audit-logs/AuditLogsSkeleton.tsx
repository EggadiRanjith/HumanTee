/**
 * Audit Logs Skeleton - PROFESSIONAL QUALITY
 * Matches category cards + table layout
 */

export function AuditLogsSkeleton() {
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
            <div>
                <div className="h-8 md:h-10 w-32 bg-gray-200 rounded shimmer mb-2"></div>
                <div className="h-4 md:h-5 w-56 bg-gray-200 rounded shimmer"></div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-blue-200 opacity-40 rounded-lg shimmer"></div>
                            <div className="w-4 h-4 bg-gray-200 rounded shimmer"></div>
                        </div>
                        <div className="h-4 w-20 bg-gray-200 rounded shimmer mb-2"></div>
                        <div className="h-8 w-12 bg-gray-300 rounded shimmer"></div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-6 w-36 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-28 bg-blue-200 opacity-40 rounded shimmer"></div>
                                    </div>
                                    <div className="h-4 w-48 bg-gray-200 rounded shimmer"></div>
                                </div>
                                <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
