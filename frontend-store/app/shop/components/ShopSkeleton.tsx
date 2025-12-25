/**
 * Shop Skeleton Loader
 * Displays loading state for shop page
 */

import { ProductCardSkeleton } from '@/app/components/ui/loaders';

export function ShopSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}
