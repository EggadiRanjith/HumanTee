/**
 * Addresses Page Skeleton
 * Matches the exact layout of the addresses page with header and address cards
 */

export function AddressesSkeleton() {
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-16 sm:pb-20 lg:pb-24 font-sans">
            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                <div className="py-11 sm:py-8 md:py-10 lg:py-14">
                    {/* Header with Back Button Skeleton */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-14 flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-white/10 rounded-lg" />
                        <div>
                            <div className="h-10 sm:h-12 lg:h-14 w-64 bg-white/10 rounded mb-2" />
                            <div className="h-4 w-48 bg-white/10 rounded" />
                        </div>
                    </div>

                    {/* Addresses Section Skeleton */}
                    <div className="p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl luxury-glass border border-white/10 bg-white/5 animate-pulse">
                        {/* Section Header with Add Button */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg" />
                                <div className="h-6 w-40 bg-white/10 rounded" />
                            </div>
                            <div className="h-10 w-32 bg-white/10 rounded-lg" />
                        </div>

                        {/* Address Cards */}
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 space-y-2">
                                            {/* Name + Default Badge */}
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 w-32 bg-white/10 rounded" />
                                                {i === 1 && <div className="h-5 w-16 bg-white/10 rounded-full" />}
                                            </div>
                                            {/* Contact Info */}
                                            <div className="h-4 w-48 bg-white/10 rounded" />
                                            {/* Address Line 1 */}
                                            <div className="h-4 w-full bg-white/10 rounded" />
                                            {/* Address Line 2 */}
                                            <div className="h-4 w-3/4 bg-white/10 rounded" />
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex gap-2 ml-4">
                                            {i !== 1 && <div className="w-8 h-8 bg-white/10 rounded-lg" />}
                                            <div className="w-8 h-8 bg-white/10 rounded-lg" />
                                            {i !== 1 && <div className="w-8 h-8 bg-white/10 rounded-lg" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
