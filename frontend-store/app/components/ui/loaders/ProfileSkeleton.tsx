/**
 * ProfileSkeleton Component
 * Loading placeholder for profile page
 */

export function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-lg">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Info */}
                <div className="space-y-3 flex-1">
                    <div className="h-6 bg-white/10 rounded w-48" />
                    <div className="h-4 bg-white/5 rounded w-64" />
                </div>

                {/* Edit button */}
                <div className="h-9 bg-white/10 rounded w-20" />
            </div>

            {/* Info Sections */}
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-white/10 rounded-lg p-6 space-y-4 bg-white/5">
                    {/* Section title */}
                    <div className="flex justify-between items-center">
                        <div className="h-5 bg-white/10 rounded w-40" />
                        <div className="h-8 bg-white/5 rounded w-16" />
                    </div>

                    {/* Section content */}
                    <div className="space-y-3 pt-2">
                        <div className="h-4 bg-white/5 rounded w-full" />
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        {i === 1 && (
                            <>
                                <div className="h-4 bg-white/5 rounded w-full mt-4" />
                                <div className="h-4 bg-white/5 rounded w-2/3" />
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
