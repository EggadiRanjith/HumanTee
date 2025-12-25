/**
 * Tickets Error State Component
 * Displayed when ticket fetching fails
 */

import { InlineError } from '@/app/components/ui/errors';

interface TicketsErrorProps {
    onRetry: () => void;
}

export function TicketsError({ onRetry }: TicketsErrorProps) {
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    return (
        <div className="py-16">
            <InlineError
                title="Unable to load tickets"
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
