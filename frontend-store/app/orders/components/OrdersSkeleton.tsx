/**
 * Orders Skeleton Loader
 * Loading state for orders list
 */

import { OrderCardSkeleton } from '@/app/components/ui/loaders';

interface OrdersSkeletonProps {
    count?: number;
}

export function OrdersSkeleton({ count = 6 }: OrdersSkeletonProps) {
    return (
        <div className="space-y-5">
            {Array.from({ length: count }).map((_, index) => (
                <OrderCardSkeleton key={index} />
            ))}
        </div>
    );
}
