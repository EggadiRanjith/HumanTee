/**
 * Hero Skeleton Loader
 * Premium loading state matching real hero layout
 */

export default function HeroSkeleton() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-4"
            aria-label="Loading hero content"
        >
            {/* Background with gradient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_infinite]" />
            </div>

            {/* Content skeleton */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
                <div className="max-w-3xl space-y-4 sm:space-y-6">
                    {/* Main heading skeleton - 2 lines */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="
                            h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28
                            bg-gradient-to-r from-white/5 via-white/10 to-white/5
                            rounded-lg
                            relative overflow-hidden
                        ">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                        <div className="
                            h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28
                            w-3/4
                            bg-gradient-to-r from-white/5 via-white/10 to-white/5
                            rounded-lg
                            relative overflow-hidden
                        ">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.2s' }} />
                        </div>
                    </div>

                    {/* Subheading skeleton */}
                    <div className="
                        h-5 sm:h-6 md:h-7
                        w-2/3
                        bg-gradient-to-r from-white/5 via-white/10 to-white/5
                        rounded-md
                        relative overflow-hidden
                    " style={{ animationDelay: '0.3s' }}>
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.4s' }} />
                    </div>

                    {/* Button skeleton */}
                    <div className="
                        h-12 sm:h-14 md:h-16
                        w-40 sm:w-48
                        bg-gradient-to-r from-white/10 via-white/15 to-white/10
                        rounded-full
                        relative overflow-hidden
                    " style={{ animationDelay: '0.5s' }}>
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" style={{ animationDelay: '0.6s' }} />
                    </div>
                </div>
            </div>

            {/* Scroll hint skeleton */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                <div className="w-[1px] h-12 bg-white/10 animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
        </section>
    );
}
