export function TicketsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    );
}
