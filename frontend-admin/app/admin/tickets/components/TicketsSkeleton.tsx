/**
 * Tickets Skeleton - PROFESSIONAL QUALITY
 * Matches exact layout with shimmer animation
 */

export function TicketsSkeleton() {
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
                    <div className="h-8 md:h-9 lg:h-10 w-40 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="h-4 md:h-5 w-52 bg-gray-200 rounded shimmer"></div>
                </div>
                <div className="h-9 md:h-10 w-28 md:w-36 bg-gray-200 rounded-lg shimmer"></div>
            </div>

            {/* Filters Bar Skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
                <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg shimmer"></div>
                    <div className="w-32 h-10 bg-gray-200 rounded-lg shimmer"></div>
                </div>
            </div>

            {/* Ticket Cards Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            {/* Left section */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-20 bg-gray-300 rounded shimmer"></div>
                                    <div className="h-6 w-24 bg-yellow-200 opacity-40 rounded shimmer"></div>
                                </div>
                                <div className="h-4 w-full max-w-md bg-gray-300 rounded shimmer"></div>
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="h-3 w-32 bg-gray-200 rounded shimmer"></div>
                                    <div className="h-3 w-28 bg-gray-200 rounded shimmer"></div>
                                </div>
                            </div>

                            {/* Right section */}
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-24 bg-blue-200 opacity-40 rounded shimmer"></div>
                                <div className="h-8 w-20 bg-gray-200 rounded-lg shimmer"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
