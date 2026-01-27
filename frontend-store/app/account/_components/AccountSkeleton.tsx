/**
 * Account Page Skeleton
 * Matches the exact layout of the account dashboard
 */

import { GradientOverlay } from "@/app/components/ui/layout";

export function AccountSkeleton() {
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-16 sm:pb-20 lg:pb-24 font-sans">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                <div className="py-11 sm:py-8 md:py-10 lg:py-14">
                    {/* Header Skeleton */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-14 animate-pulse">
                        <div className="h-10 sm:h-12 lg:h-14 w-64 bg-white/10 rounded mb-2" />
                        <div className="h-4 w-48 bg-white/10 rounded" />
                    </div>

                    {/* Navigation Cards Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="p-5 sm:p-6 rounded-xl sm:rounded-2xl luxury-glass border border-white/10 bg-white/5 animate-pulse"
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
                                <div className="h-5 w-32 bg-white/10 rounded mb-2" />
                                <div className="h-4 w-full bg-white/10 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
