/**
 * FeaturedProducts Skeleton Loader
 * Displays loading state during product fetch
 * Returns only grid items - wrapper comes from parent
 */

import { ProductCardSkeleton } from "@/app/components/ui/loaders";

export default function FeaturedProductsSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </>
    );
}
