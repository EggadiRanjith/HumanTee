/**
 * CartItemSkeleton Component
 * Loading placeholder for cart items
 */

export function CartItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 bg-white/5 rounded-lg animate-pulse">
            {/* Image */}
            <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-lg relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
                {/* Title */}
                <div className="h-4 bg-white/10 rounded w-3/4" />

                {/* Variant/size */}
                <div className="h-3 bg-white/5 rounded w-1/2" />

                {/* Quantity & Price */}
                <div className="flex gap-4 items-center pt-2">
                    <div className="h-8 bg-white/10 rounded w-20" />
                    <div className="h-4 bg-white/10 rounded w-16" />
                </div>
            </div>

            {/* Remove button */}
            <div className="w-8 h-8 bg-white/5 rounded" />
        </div>
    );
}
