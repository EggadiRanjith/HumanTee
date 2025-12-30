import { EmptyState } from '@/app/components';

export function TicketsEmpty() {
    return (
        <EmptyState
            title="No tickets found"
            message="No support tickets match your current filters."
            icon="🎫"
        />
    );
}
