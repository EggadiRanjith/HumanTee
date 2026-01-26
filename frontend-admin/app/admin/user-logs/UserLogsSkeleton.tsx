/**
 * User Logs Skeleton - PROFESSIONAL QUALITY
 * Same structure as audit logs
 */

export function UserLogsSkeleton() {
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

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="h-10 bg-gray-200 rounded-lg shimmer"></div>
                    <div className="h-10 bg-gray-200 rounded-lg shimmer"></div>
                    <div className="h-10 bg-gray-200 rounded-lg shimmer"></div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                    <div className="grid grid-cols-4 gap-4">
                        {['Timestamp', 'User', 'Action', 'Details'].map((_, idx) => (
                            <div key={idx} className="h-4 bg-gray-200 rounded shimmer"></div>
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="px-6 py-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded shimmer"></div>
                                <div className="h-6 w-28 bg-blue-200 opacity-40 rounded shimmer"></div>
                                <div className="h-4 w-40 bg-gray-200 rounded shimmer"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
