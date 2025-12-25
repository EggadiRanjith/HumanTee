/**
 * Hero Skeleton Loader
 * Shows while Hero content is loading
 */

export default function HeroSkeleton() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-4"
            aria-label="Loading hero content"
        >
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse" />

            {/* Content skeleton */}
            <div className="relative z-10 max-w-2xl space-y-6 px-4">
                {/* Heading skeleton */}
                <div className="h-16 sm:h-20 md:h-24 lg:h-32 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-12 sm:h-16 md:h-20 bg-white/10 rounded-lg animate-pulse w-3/4" />

                {/* Button skeleton */}
                <div className="h-12 w-40 bg-white/10 rounded-full animate-pulse" />
            </div>

            {/* Scroll hint skeleton */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                <div className="w-[1px] h-12 bg-white/10 animate-pulse" />
            </div>
        </section>
    );
}
