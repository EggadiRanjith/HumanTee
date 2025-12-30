/**
 * Products Error Component
 */

import { ErrorDisplay } from '@/app/components';

interface ProductsErrorProps {
    error: Error;
    onRetry: () => void;
}

export function ProductsError({ error, onRetry }: ProductsErrorProps) {
    return (
        <ErrorDisplay
            error={error}
            onRetry={onRetry}
            message="Failed to load products"
        />
    );
}
