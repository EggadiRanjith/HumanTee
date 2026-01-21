/**
 * Loading Skeleton Components
 * Reusable skeleton loaders for consistent loading UX
 */

'use client';

/**
 * Generic Card Skeleton
 */
export function CardSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
    );
}

/**
 * Settings Page Skeleton
 */
export function SettingsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>

            {/* Settings Cards */}
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="space-y-3">
                        <div className="h-12 bg-gray-200 rounded" />
                        <div className="h-12 bg-gray-200 rounded" />
                        <div className="h-12 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Customer Detail Skeleton
 */
export function CustomerDetailSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="animate-pulse flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                    </div>
                ))}
            </div>

            {/* Order History */}
            <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded mb-2" />
                ))}
            </div>
        </div>
    );
}

/**
 * Analytics Skeleton
 */
export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <div className="animate-pulse flex items-center gap-4">
                <div className="h-10 bg-gray-200 rounded w-64" />
                <div className="h-10 bg-gray-200 rounded w-32" />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-6">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                        <div className="h-64 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="border-b border-gray-200 p-4">
                    <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Form Skeleton
 */
export function FormSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-12 bg-gray-200 rounded" />
                </div>
            ))}
            <div className="flex gap-3 justify-end">
                <div className="h-10 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
        </div>
    );
}
