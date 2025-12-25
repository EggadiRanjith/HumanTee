/**
 * Orders Error State Component
 * Displayed when order fetching fails
 */

import { InlineError } from '@/app/components/ui/errors';

interface OrdersErrorProps {
    onRetry: () => void;
}

export function OrdersError({ onRetry }: OrdersErrorProps) {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    return (
        <div className="py-16">
            <InlineError
                title="Unable to load orders"
                message={
                    isOffline
                        ? "You're offline. Check your connection."
                        : "Please try again."
                }
                actionLabel="Retry"
                onAction={onRetry}
            />
        </div>
    );
}
