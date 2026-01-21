/**
 * Tickets Skeleton Loader
 * Matches the exact layout of TicketCard for seamless loading experience
 * Fully responsive and mobile-friendly
 */

export function TicketsSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="group p-5 rounded-2xl luxury-glass border border-white/10 bg-white/5 animate-pulse"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left Content */}
                        <div className="space-y-2.5 flex-1">
                            {/* Ticket Number + Status Badge */}
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-32 bg-white/10 rounded" />
                                <div className="h-6 w-24 bg-white/10 rounded-full" />
                            </div>

                            {/* Subject */}
                            <div className="h-4 w-3/4 bg-white/10 rounded" />

                            {/* Category */}
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-28 bg-white/10 rounded" />
                            </div>
                        </div>

                        {/* Right Content - Dates */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 min-w-fit">
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-1.5">
                                {/* Opened Date */}
                                <div className="flex flex-col items-start sm:items-end space-y-1">
                                    <div className="h-2 w-12 bg-white/10 rounded" />
                                    <div className="h-3 w-20 bg-white/10 rounded" />
                                </div>

                                {/* Last Activity */}
                                <div className="flex flex-col items-end sm:items-end space-y-1">
                                    <div className="h-2 w-16 bg-white/10 rounded" />
                                    <div className="h-3 w-20 bg-white/10 rounded" />
                                </div>
                            </div>

                            {/* Chevron */}
                            <div className="w-5 h-5 bg-white/10 rounded hidden sm:block" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
