/**
 * Reviews Skeleton Loader
 */

import { SectionHeader } from "@/app/components/ui/layout";

export default function ReviewsSkeleton() {
    return (
        <section
            className="relative overflow-hidden py-16 sm:py-20 md:py-24 sm:px-6 lg:px-10"
            aria-label="Loading reviews"
        >
            {/* Section Header */}
            <div className="px-4 sm:px-0">
                <SectionHeader title="What Our Customers Say" variant="centered" />
            </div>

            {/* Skeleton Cards */}
            <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-0 mt-8">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-[85vw] sm:w-[300px] md:w-[360px] shrink-0 bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                        {/* Name */}
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                        {/* Role */}
                        <div className="h-3 bg-gray-200 rounded w-24 mb-4" />
                        {/* Stars */}
                        <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
                        {/* Text */}
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
