/**
 * Footer Skeleton Loader Component
 * Exact copy of Footer structure with skeleton placeholders
 */

"use client";

export default function FooterSkeleton() {
    return (
        <>
            {/* Brand Column */}
            <div className="flex flex-col gap-2 items-center sm:items-start">
                {/* Logo skeleton */}
                <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse mb-2" />

                {/* Brand name skeleton */}
                <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-1" />

                {/* Tagline skeleton */}
                <div className="h-3 w-48 bg-white/10 rounded animate-pulse opacity-60 mb-4" style={{ animationDelay: '100ms' }} />

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

            {/* Navigation Column 1 */}
            <div className="space-y-3">
                {/* Title */}
                <div className="h-4 w-16 bg-white/10 rounded animate-pulse mb-4" />
                {/* Links */}
                <div className="space-y-2.5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-3 w-24 bg-white/10 rounded animate-pulse"
                            style={{ animationDelay: `${i * 50}ms` }}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Column 2 */}
            <div className="space-y-3">
                {/* Title */}
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-4" />
                {/* Links */}
                <div className="space-y-2.5">
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
