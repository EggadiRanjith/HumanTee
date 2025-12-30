/**
 * Products Skeleton Component
 */

export function ProductsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-4">
                <div className="h-10 bg-gray-200 rounded w-64"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    );
}
