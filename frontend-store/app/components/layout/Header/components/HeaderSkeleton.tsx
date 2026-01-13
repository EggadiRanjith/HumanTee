/**
 * Header Skeleton Loader Component
 * Shows while header data is loading
 */

"use client";

import { ICON_SIZES } from "../constants";

export default function HeaderSkeleton() {
    return (
        <>
            {/* Mobile Menu Button Skeleton */}
            <div className="md:hidden p-1.5 sm:p-2">
                <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] bg-white/10 rounded animate-pulse" />
            </div>

            {/* Brand Skeleton */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
                {/* Logo skeleton - sleek and modern */}
                <div className="
          h-[28px] xs:h-[30px] sm:h-[32px] md:h-[34px] lg:h-[36px]
          w-[56px] xs:w-[60px] sm:w-[64px] md:w-[68px] lg:w-[72px]
          bg-gradient-to-r from-white/5 via-white/10 to-white/5
          rounded-md
          animate-pulse
          relative overflow-hidden
        ">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Brand name skeleton - single line to match real header */}
                <div className="
            h-[16px] xs:h-[17px] sm:h-[18px] md:h-[20px] lg:h-[22px] xl:h-[24px]
            w-[100px] xs:w-[120px] sm:w-[140px] md:w-[160px]
            bg-gradient-to-r from-white/5 via-white/10 to-white/5
            rounded-md
            animate-pulse
            relative overflow-hidden
          ">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.3s' }} />
                </div>
            </div>

            {/* Desktop Nav Skeleton - 3 links to match real nav */}
            <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-4 w-16 bg-white/10 rounded animate-pulse"
                        style={{ animationDelay: `${i * 50}ms` }}
                    />
                ))}
            </nav>

            {/* Right Section Skeleton */}
            <div className="flex items-center gap-6">
                {/* Mobile Icons */}
                <div className="md:hidden flex items-center gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] bg-white/10 rounded-full animate-pulse" />
                    <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                </div>

                {/* Desktop Icons */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="w-7 h-7 bg-white/10 rounded-full animate-pulse" />
                    <div className="w-7 h-7 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                </div>
            </div>
        </>
    );
}
