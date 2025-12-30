/**
 * Orders Error Component
 */

import { ErrorDisplay } from '@/app/components';

interface OrdersErrorProps {
    error: Error;
    onRetry: () => void;
}

export function OrdersError({ error, onRetry }: OrdersErrorProps) {
    return (
        <ErrorDisplay
            error={error}
            onRetry={onRetry}
            message="Failed to load orders"
        />
    );
}
