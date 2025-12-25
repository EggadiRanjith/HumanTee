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
                {/* Logo skeleton */}
                <div className="
          h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px]
          w-[20px] xs:w-[22px] sm:w-[24px] md:w-[26px] lg:w-[28px]
          bg-white/10 rounded animate-pulse
        " />

                {/* Brand name skeleton - multi-bar */}
                <div className="space-y-1.5">
                    <div className="
            h-[14px] xs:h-[15px] sm:h-[16px] md:h-[18px]
            w-[100px] xs:w-[120px] sm:w-[140px]
            bg-white/10 rounded animate-pulse
          " />
                    <div className="
            h-[10px] xs:h-[11px] sm:h-[12px]
            w-[70px] xs:w-[80px] sm:w-[90px]
            bg-white/10 rounded animate-pulse
            opacity-60
          " style={{ animationDelay: '75ms' }} />
                </div>
            </div>

            {/* Desktop Nav Skeleton */}
            <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                {[1, 2, 3, 4].map((i) => (
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
