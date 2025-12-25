/**
 * Tickets Skeleton Loader
 * Loading state for tickets list
 */

export function TicketsSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="p-5 rounded-2xl luxury-glass border border-white/10 bg-white/5 animate-pulse"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-32 bg-white/10 rounded"></div>
                                <div className="h-6 w-24 bg-white/10 rounded-full"></div>
                            </div>
                            <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                            <div className="flex items-center gap-4">
                                <div className="h-3 w-20 bg-white/10 rounded"></div>
                                <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                <div className="h-3 w-32 bg-white/10 rounded"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="space-y-1">
                                <div className="h-3 w-20 bg-white/10 rounded"></div>
                                <div className="h-3 w-16 bg-white/10 rounded"></div>
                            </div>
                            <div className="w-5 h-5 bg-white/10 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
