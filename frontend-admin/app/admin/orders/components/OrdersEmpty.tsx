/**
 * Orders Empty State Component
 */

import { EmptyState } from '@/app/components';

export function OrdersEmpty() {
    return (
        <EmptyState
            title="No orders found"
            message="No orders match your current filters. Try adjusting your search criteria."
            icon="📦"
        />
    );
}
