/**
 * Loading Skeletons for Better Perceived Performance
 */

export function ProductListSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4 p-4 border rounded-lg">
                    <div className="rounded bg-gray-200 h-20 w-20"></div>
                    <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="animate-pulse border rounded-lg p-4">
            <div className="bg-gray-200 h-48 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 10, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <div className="animate-pulse">
            <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 p-4 flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="p-4 flex gap-4 border-t">
                        {Array.from({ length: columns }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div className="animate-pulse space-y-6 p-6">
            {/* Header */}
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>

            {/* Content */}
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            ))}
            <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
    );
}
