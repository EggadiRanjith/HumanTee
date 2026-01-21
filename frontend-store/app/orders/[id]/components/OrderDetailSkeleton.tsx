/**
 * Order Detail Skeleton Loader
 * Matches the exact layout of the order detail page
 * Fully responsive and mobile-friendly
 */

export function OrderDetailSkeleton() {
    return (
        <div className="min-h-screen brand-bg-dusk pt-[var(--header-height)]">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-8">
                {/* Back Button Skeleton */}
                <div className="h-4 w-32 bg-white/10 rounded mb-6 animate-pulse" />

                {/* Page Title */}
                <div className="mb-10 space-y-2 animate-pulse">
                    <div className="h-10 sm:h-12 lg:h-14 w-64 bg-white/10 rounded" />
                    <div className="h-3 w-48 bg-white/10 rounded" />
                </div>

                {/* Order Header Skeleton */}
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl luxury-glass border border-white/10 bg-white/5 mb-6 animate-pulse">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="h-6 w-40 bg-white/10 rounded" />
                            <div className="h-4 w-32 bg-white/10 rounded" />
                        </div>
                        <div className="h-8 w-28 bg-white/10 rounded-full" />
                    </div>
                </div>

                {/* Order Summary Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="p-4 sm:p-6 rounded-xl luxury-glass border border-white/10 bg-white/5 animate-pulse">
                        <div className="h-5 w-32 bg-white/10 rounded mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-white/10 rounded" />
                            <div className="h-4 w-5/6 bg-white/10 rounded" />
                            <div className="h-4 w-4/6 bg-white/10 rounded" />
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="p-4 sm:p-6 rounded-xl luxury-glass border border-white/10 bg-white/5 animate-pulse">
                        <div className="h-5 w-32 bg-white/10 rounded mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-white/10 rounded" />
                            <div className="h-4 w-3/6 bg-white/10 rounded" />
                        </div>
                    </div>
                </div>

                {/* Order Items Skeleton */}
                <div className="p-4 sm:p-6 rounded-xl luxury-glass border border-white/10 bg-white/5 mb-6 animate-pulse">
                    <div className="h-5 w-32 bg-white/10 rounded mb-4" />
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="w-20 h-24 bg-white/10 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                                    <div className="h-4 w-24 bg-white/10 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Summary */}
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 w-20 bg-white/10 rounded" />
                            <div className="h-4 w-16 bg-white/10 rounded" />
                        </div>
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-white/10 rounded" />
                            <div className="h-4 w-16 bg-white/10 rounded" />
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/10">
                            <div className="h-5 w-16 bg-white/10 rounded" />
                            <div className="h-5 w-20 bg-white/10 rounded" />
                        </div>
                    </div>
                </div>

                {/* Need Help Button Skeleton */}
                <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}
