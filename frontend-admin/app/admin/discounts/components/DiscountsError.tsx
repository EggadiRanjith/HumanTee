import { ErrorDisplay } from '@/app/components';

interface DiscountsErrorProps {
    error: Error;
    onRetry: () => void;
}

export function DiscountsError({ error, onRetry }: DiscountsErrorProps) {
    return <ErrorDisplay error={error} onRetry={onRetry} message="Failed to load discounts" />;
}
