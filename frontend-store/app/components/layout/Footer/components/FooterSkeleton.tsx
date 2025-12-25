/**
 * Footer Skeleton Loader Component
 */

"use client";

export default function FooterSkeleton() {
    return (
        <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Brand Column Skeleton */}
            <div className="flex flex-col gap-2 items-center sm:items-start">
                {/* Brand name */}
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />

                {/* Tagline */}
                <div className="space-y-1.5 mt-1">
                    <div className="h-3 w-48 bg-white/10 rounded animate-pulse opacity-60" style={{ animationDelay: '75ms' }} />
                    <div className="h-3 w-40 bg-white/10 rounded animate-pulse opacity-60" style={{ animationDelay: '150ms' }} />
                </div>

                {/* Social links */}
                <div className="flex gap-6 mt-4">
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

            {/* Nav Column 1 Skeleton */}
            <div className="space-y-3">
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-3 w-24 bg-white/10 rounded animate-pulse"
                            style={{ animationDelay: `${i * 50}ms` }}
                        />
                    ))}
                </div>
            </div>

            {/* Nav Column 2 Skeleton */}
            <div className="space-y-3">
                <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-3 w-32 bg-white/10 rounded animate-pulse"
                            style={{ animationDelay: `${i * 50 + 200}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
