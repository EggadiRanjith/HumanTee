/**
 * Page Skeleton Component
 * Loading placeholder for page content
 */

export function PageSkeleton() {
    return (
        <div className="space-y-6 p-6 animate-pulse">
            {/* Header skeleton */}
            <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
