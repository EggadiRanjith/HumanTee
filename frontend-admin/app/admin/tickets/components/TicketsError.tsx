import { ErrorDisplay } from '@/app/components';

interface TicketsErrorProps {
    error: Error;
    onRetry: () => void;
}

export function TicketsError({ error, onRetry }: TicketsErrorProps) {
    return <ErrorDisplay error={error} onRetry={onRetry} message="Failed to load tickets" />;
}
