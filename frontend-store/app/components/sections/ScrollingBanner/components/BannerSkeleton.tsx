/**
 * ScrollingBanner Skeleton Loader
 */

export default function BannerSkeleton() {
    return (
        <section
            className="relative w-full py-3 xs:py-4 overflow-hidden bg-white border-y border-gray-200"
            aria-label="Loading banner"
        >
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 xs:w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 xs:w-16 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Skeleton content */}
            <div className="relative flex items-center justify-center">
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
        </section>
    );
}
