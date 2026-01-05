/**
 * FeaturedProducts Skeleton Loader
 * Displays loading state during product fetch
 * Uses same optimized approach as ShopSkeleton
 */

import { ProductCardSkeleton } from "@/app/components/ui/loaders";

export default function FeaturedProductsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
