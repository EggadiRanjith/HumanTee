/**
 * OrderCardSkeleton Component
 * Loading placeholder for order list items
 */

export function OrderCardSkeleton() {
    return (
        <div className="border border-white/10 rounded-lg p-6 space-y-4 animate-pulse bg-white/5">
            {/* Header - Order number and status */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-32" />
                    <div className="h-3 bg-white/5 rounded w-24" />
                </div>
                <div className="h-6 bg-white/5 rounded w-20" />
            </div>

            {/* Items preview */}
            <div className="space-y-2 pt-2">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>

            {/* Footer - Total and action */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="space-y-1">
                    <div className="h-3 bg-white/5 rounded w-16" />
                    <div className="h-5 bg-white/10 rounded w-20" />
                </div>
                <div className="h-9 bg-white/10 rounded w-24" />
            </div>
        </div>
    );
}
