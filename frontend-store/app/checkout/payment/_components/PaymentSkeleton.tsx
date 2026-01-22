/**
 * Payment Page Skeleton
 * Matches the exact layout of the payment page with checkout progress,
 * payment method selection, delivery info, and order summary
 */

export function PaymentSkeleton() {
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10">
                    {/* Checkout Progress Skeleton */}
                    <div className="mb-8 sm:mb-10 animate-pulse">
                        <div className="flex justify-center gap-4">
                            <div className="h-10 w-10 bg-white/10 rounded-full" />
                            <div className="h-10 w-10 bg-white/10 rounded-full" />
                            <div className="h-10 w-10 bg-white/10 rounded-full" />
                        </div>
                    </div>

                    {/* Page Title Skeleton */}
                    <div className="h-7 w-48 bg-white/10 rounded mb-5 sm:mb-6 md:mb-8 animate-pulse" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {/* Left Column - Payment & Delivery */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
                            {/* Payment Method Selection Skeleton */}
                            <div className="p-4 sm:p-5 md:p-6 rounded-xl luxury-glass border border-white/10 animate-pulse">
                                <div className="h-6 w-40 bg-white/10 rounded mb-4" />

                                {/* Payment Options */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3"
                                        >
                                            <div className="w-5 h-5 bg-white/10 rounded-full" />
                                            <div className="h-5 w-32 bg-white/10 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Info Skeleton */}
                            <div className="p-4 sm:p-5 md:p-6 rounded-xl luxury-glass border border-white/10 animate-pulse">
                                <div className="h-5 w-36 bg-white/10 rounded mb-3" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-white/10 rounded" />
                                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                                </div>
                            </div>

                            {/* Action Buttons Skeleton */}
                            <div className="flex gap-3">
                                <div className="h-12 flex-1 bg-white/10 rounded-full" />
                                <div className="h-12 flex-1 bg-white/10 rounded-full" />
                            </div>
                        </div>

                        {/* Right Column - Order Summary Skeleton */}
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
                                        <div className="h-4 w-24 bg-white/10 rounded" />
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
