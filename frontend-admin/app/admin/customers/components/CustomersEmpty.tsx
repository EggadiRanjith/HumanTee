import { EmptyState } from '@/app/components';

export function CustomersEmpty() {
    return (
        <EmptyState
            title="No customers found"
            message="No customers match your current filters."
            icon="👥"
        />
    );
}
