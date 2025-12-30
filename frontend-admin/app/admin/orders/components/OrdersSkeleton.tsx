/**
 * Orders Skeleton Component
 */

export function OrdersSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>

            {/* Filters skeleton */}
            <div className="flex gap-4">
                <div className="h-10 bg-gray-200 rounded w-64"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Table skeleton */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-12 bg-gray-100"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 border-t border-gray-200 bg-white"></div>
                ))}
            </div>
        </div>
    );
}
