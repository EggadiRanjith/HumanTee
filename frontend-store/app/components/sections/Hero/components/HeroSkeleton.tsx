/**
 * Hero Skeleton Loader
 * Professional skeleton showing layout structure without clutter
 */

export default function HeroSkeleton() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-4"
            aria-label="Loading hero content"
        >
            {/* Background with subtle shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-[shimmer_4s_infinite]" />
            </div>

            {/* Subtle ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '3s' }} />
            </div>

            {/* Content skeleton - very compact for mobile */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
                <div className="max-w-3xl space-y-3 sm:space-y-5">
                    {/* Heading skeleton - very small on mobile */}
                    <div className="space-y-2 sm:space-y-3">
                        <div className="h-8 xs:h-10 sm:h-14 md:h-18 lg:h-22 bg-white/8 rounded-lg sm:rounded-xl animate-pulse" />
                        <div className="h-8 xs:h-10 sm:h-14 md:h-18 lg:h-22 w-[75%] bg-white/8 rounded-lg sm:rounded-xl animate-pulse" style={{ animationDelay: '0.15s' }} />
                    </div>

                    {/* Subheading skeleton - very compact */}
                    <div className="h-4 sm:h-5 md:h-6 w-[50%] bg-white/6 rounded-md animate-pulse" style={{ animationDelay: '0.3s' }} />

                    {/* Button skeleton - much smaller on mobile */}
                    <div className="pt-1">
                        <div className="h-10 sm:h-12 md:h-14 w-36 sm:w-44 md:w-48 bg-gradient-to-r from-white/12 to-white/10 rounded-full animate-pulse shadow-lg shadow-white/5" style={{ animationDelay: '0.45s' }} />
                    </div>
                </div>
            </div>

            {/* Mouse scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50">
                <div className="w-6 h-10 border-2 border-white/25 rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-2.5 bg-white/40 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                </div>
            </div>
        </section>
    );
}
