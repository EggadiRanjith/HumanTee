/**
 * Reviews Skeleton Loader
 * Premium loading state matching reviews layout
 */

import { SectionHeader } from "@/app/components/ui/layout";

export default function ReviewsSkeleton() {
    return (
        <section
            className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 lg:px-10"
            aria-label="Loading reviews"
        >
            {/* Section Header */}
            <div className="px-4 sm:px-0">
                <SectionHeader title="What Our Customers Say" variant="centered" />
            </div>

            {/* Skeleton Cards - premium shimmer version */}
            <div className="overflow-x-auto pb-4 w-full px-4 sm:px-0 mt-8">
                <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-[70vw] max-w-[280px] sm:w-auto shrink-0 sm:min-w-[300px] md:min-w-[360px] bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6"
                        >
                            {/* Avatar */}
                            <div className="
                                w-12 h-12 rounded-full mb-4
                                bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                relative overflow-hidden
                            ">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1}s` }} />
                            </div>

                            {/* Name */}
                            <div className="
                                h-4 rounded w-32 mb-2
                                bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                relative overflow-hidden
                            ">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                            </div>

                            {/* Role */}
                            <div className="
                                h-3 rounded w-24 mb-4
                                bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                relative overflow-hidden
                            ">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1 + 0.2}s` }} />
                            </div>

                            {/* Stars */}
                            <div className="
                                h-4 rounded w-20 mb-4
                                bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                relative overflow-hidden
                            ">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1 + 0.3}s` }} />
                            </div>

                            {/* Text lines */}
                            <div className="space-y-2">
                                <div className="
                                    h-3 rounded w-full
                                    bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                    relative overflow-hidden
                                ">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1 + 0.4}s` }} />
                                </div>
                                <div className="
                                    h-3 rounded w-full
                                    bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                    relative overflow-hidden
                                ">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1 + 0.5}s` }} />
                                </div>
                                <div className="
                                    h-3 rounded w-3/4
                                    bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
                                    relative overflow-hidden
                                ">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animationDelay: `${i * 0.1 + 0.6}s` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
