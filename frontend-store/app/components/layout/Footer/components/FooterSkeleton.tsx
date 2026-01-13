/**
 * Footer Skeleton Loader Component
 * Matches real footer structure: mobile accordions, desktop columns
 */

"use client";

export default function FooterSkeleton() {
    return (
        <>
            {/* Brand Column */}
            <div className="flex flex-col gap-2 items-center sm:items-start">
                {/* Logo skeleton - sleek */}
                <div className="
                    h-[28px] w-[56px]
                    bg-gradient-to-r from-white/5 via-white/10 to-white/5
                    rounded-md animate-pulse mb-2
                    relative overflow-hidden
                ">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Brand name skeleton */}
                <div className="
                    h-5 w-32
                    bg-gradient-to-r from-white/5 via-white/10 to-white/5
                    rounded-md animate-pulse mb-1
                    relative overflow-hidden
                ">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.2s' }} />
                </div>

                {/* Tagline skeleton */}
                <div className="
                    h-3 w-48
                    bg-gradient-to-r from-white/5 via-white/10 to-white/5
                    rounded-md animate-pulse opacity-60 mb-4
                    relative overflow-hidden
                " style={{ animationDelay: '100ms' }}>
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.4s' }} />
                </div>

                {/* Social links skeleton */}
                <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-16 bg-white/10 rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '250ms' }} />
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-16 bg-white/10 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '350ms' }} />
                    </div>
                </div>
            </div>

            {/* Navigation Column 1 - Mobile: Accordion Button, Desktop: Column */}
            <div>
                {/* Mobile accordion button skeleton */}
                <div className="sm:hidden flex justify-between items-center w-full py-3 border-b border-white/10">
                    <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
                </div>

                {/* Desktop title skeleton */}
                <div className="hidden sm:block h-3 w-16 bg-white/10 rounded animate-pulse mb-4" />

                {/* Desktop links skeleton (hidden on mobile) */}
                <div className="hidden sm:block space-y-2.5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-3 w-24 bg-white/10 rounded animate-pulse"
                            style={{ animationDelay: `${i * 50}ms` }}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Column 2 - Mobile: Accordion Button, Desktop: Column */}
            <div>
                {/* Mobile accordion button skeleton */}
                <div className="sm:hidden flex justify-between items-center w-full py-3 border-b border-white/10">
                    <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
                </div>

                {/* Desktop title skeleton */}
                <div className="hidden sm:block h-3 w-20 bg-white/10 rounded animate-pulse mb-4" />

                {/* Desktop links skeleton (hidden on mobile) */}
                <div className="hidden sm:block space-y-2.5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-3 w-32 bg-white/10 rounded animate-pulse"
                            style={{ animationDelay: `${i * 50 + 200}ms` }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
