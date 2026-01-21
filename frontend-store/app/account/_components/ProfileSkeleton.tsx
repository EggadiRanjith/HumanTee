/**
 * Profile Page Skeleton
 * Matches the exact layout of the profile edit form
 */

export function ProfileSkeleton() {
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-16 sm:pb-20 lg:pb-24 font-sans">
            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                <div className="py-11 sm:py-8 md:py-10 lg:py-14">
                    {/* Header with Back Button Skeleton */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-14 flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-white/10 rounded-lg" />
                        <div>
                            <div className="h-10 sm:h-12 lg:h-14 w-64 bg-white/10 rounded mb-2" />
                            <div className="h-4 w-48 bg-white/10 rounded" />
                        </div>
                    </div>

                    {/* Profile Form Skeleton */}
                    <div className="p-5 sm:p-6 md:p-7 lg:p-8 rounded-xl sm:rounded-2xl luxury-glass border border-white/10 bg-white/5 animate-pulse">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg" />
                            <div className="h-6 w-32 bg-white/10 rounded" />
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                            {/* Full Name Field */}
                            <div>
                                <div className="h-3 w-20 bg-white/10 rounded mb-2" />
                                <div className="h-12 w-full bg-white/10 rounded-lg" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <div className="h-3 w-24 bg-white/10 rounded mb-2" />
                                <div className="h-12 w-full bg-white/10 rounded-lg" />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <div className="h-3 w-28 bg-white/10 rounded mb-2" />
                                <div className="h-12 w-full bg-white/10 rounded-lg" />
                            </div>

                            {/* Save Button */}
                            <div className="pt-4">
                                <div className="h-12 w-32 bg-white/10 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
