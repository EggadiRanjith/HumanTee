/**
 * ProductCardSkeleton Component
 * Loading placeholder that matches ProductCard dimensions
 */

export function ProductCardSkeleton() {
    return (
        <div className="group relative rounded-lg overflow-hidden bg-white/5 animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-[4/5] bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-4 bg-white/10 rounded w-3/4" />

                {/* Subtitle/Description */}
                <div className="h-3 bg-white/5 rounded w-1/2" />

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                    <div className="h-5 bg-white/10 rounded w-20" />
                    <div className="h-4 bg-white/5 rounded w-16" />
                </div>

                {/* Stock indicator */}
                <div className="h-3 bg-white/5 rounded w-24 mt-1" />
            </div>
        </div>
    );
}

// Add shimmer animation to globals.css
const shimmerStyles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;
