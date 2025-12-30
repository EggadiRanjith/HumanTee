import { ErrorDisplay } from '@/app/components';

interface CustomersErrorProps {
    error: Error;
    onRetry: () => void;
}

export function CustomersError({ error, onRetry }: CustomersErrorProps) {
    return <ErrorDisplay error={error} onRetry={onRetry} message="Failed to load customers" />;
}
