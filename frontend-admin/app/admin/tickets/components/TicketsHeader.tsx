import { PageHeader } from '@/app/components';

export function TicketsHeader() {
    return (
        <PageHeader
            title="Support Tickets"
            description="Manage customer support requests"
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Tickets' }
            ]}
        />
    );
}
