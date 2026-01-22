/**
 * Shipping Page Skeleton
 * Matches the exact layout of the shipping page with checkout progress,
 * address selection area, and order summary
 */

export function ShippingSkeleton() {
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10 lg:py-12">
                    {/* Checkout Progress Skeleton */}
                    <div className="mb-8 sm:mb-10 animate-pulse">
                        <div className="flex justify-center gap-4">
                            <div className="h-10 w-10 bg-white/10 rounded-full" />
                            <div className="h-10 w-10 bg-white/10 rounded-full" />
                            <div className="h-10 w-10 bg-white/10 rounded-full" />
                        </div>
                    </div>

                    {/* Page Title Skeleton */}
                    <div className="h-6 w-64 bg-white/10 rounded mb-4 sm:mb-5 animate-pulse" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {/* Address Selection Skeleton */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-5">
                            <div className="p-3 sm:p-4 md:p-5 lg:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10 animate-pulse">
                                {/* Add Address Button Skeleton */}
                                <div className="h-12 w-full bg-white/10 rounded-lg mb-4" />

                                {/* Address Cards Skeleton */}
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="p-4 rounded-lg bg-white/5 border border-white/10"
                                        >
                                            <div className="space-y-2">
                                                <div className="h-5 w-32 bg-white/10 rounded" />
                                                <div className="h-4 w-48 bg-white/10 rounded" />
                                                <div className="h-4 w-full bg-white/10 rounded" />
                                                <div className="h-4 w-3/4 bg-white/10 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons Skeleton */}
                                <div className="flex gap-3 mt-6">
                                    <div className="h-12 flex-1 bg-white/10 rounded-full" />
                                    <div className="h-12 flex-1 bg-white/10 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="p-4 sm:p-5 rounded-xl luxury-glass border border-white/10 animate-pulse">
                                <div className="h-6 w-32 bg-white/10 rounded mb-4" />

                                {/* Items Skeleton */}
                                <div className="space-y-3 mb-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-16 h-16 bg-white/10 rounded" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-full bg-white/10 rounded" />
                                                <div className="h-3 w-20 bg-white/10 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Summary Skeleton */}
                                <div className="border-t border-white/10 pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-20 bg-white/10 rounded" />
                                        <div className="h-4 w-16 bg-white/10 rounded" />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-5 w-24 bg-white/10 rounded" />
                                        <div className="h-5 w-20 bg-white/10 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
