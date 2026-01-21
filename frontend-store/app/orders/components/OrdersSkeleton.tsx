/**
 * Orders Skeleton Loader
 * Matches the exact layout of OrderCard for seamless loading experience
 * Fully responsive and mobile-friendly
 */

export function OrdersSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-5">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="p-4 sm:p-6 rounded-xl sm:rounded-2xl luxury-glass border border-white/10 bg-white/5 backdrop-blur-xl animate-pulse"
                >
                    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
                        {/* Left Content */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                {/* Order Number + Status Badge */}
                                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                                    <div className="h-4 w-32 bg-white/10 rounded" />
                                    <div className="h-6 w-24 bg-white/10 rounded-md" />
                                </div>

                                {/* Date + Items Count */}
                                <div className="h-3 w-40 bg-white/10 rounded mb-1" />

                                {/* Tracking Number (optional) */}
                                <div className="h-3 w-48 bg-white/10 rounded" />
                            </div>

                            {/* Amount + CTA */}
                            <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 flex-wrap">
                                <div className="h-5 w-20 bg-white/10 rounded" />
                                <div className="h-11 w-32 bg-white/10 rounded-lg sm:rounded-xl" />
                            </div>
                        </div>

                        {/* Right Image Cluster */}
                        <div className="flex-shrink-0 flex gap-1.5 sm:gap-2">
                            <div className="w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-white/10 rounded-lg" />
                            <div className="w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-white/10 rounded-lg" />
                            <div className="w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-white/10 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
