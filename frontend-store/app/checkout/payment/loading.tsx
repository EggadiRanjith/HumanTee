export default function Loading() {
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10">
                    {/* Progress skeleton */}
                    <div className="flex justify-between items-center mb-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
                                {step < 3 && (
                                    <div className="flex-1 h-0.5 bg-white/5 mx-4" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Title skeleton */}
                    <div className="h-7 bg-white/10 rounded w-48 mb-6 animate-pulse" />

                    {/* Grid skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Payment methods skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-6 rounded-xl luxury-glass border border-white/10 animate-pulse">
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-16 bg-white/5 rounded-lg" />
                                    ))}
                                </div>
                            </div>

                            {/* Delivery info skeleton */}
                            <div className="p-6 rounded-xl luxury-glass border border-white/10 animate-pulse">
                                <div className="h-6 bg-white/10 rounded w-40 mb-4" />
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-4 bg-white/5 rounded w-full" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order summary skeleton */}
                        <div className="lg:col-span-1">
                            <div className="p-5 rounded-xl luxury-glass border border-white/10 animate-pulse">
                                <div className="h-6 bg-white/10 rounded w-32 mb-4" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex justify-between">
                                            <div className="h-4 bg-white/5 rounded w-24" />
                                            <div className="h-4 bg-white/5 rounded w-16" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
