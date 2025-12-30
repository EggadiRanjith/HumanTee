import { PageHeader } from '@/app/components';

export function CustomersHeader() {
    return (
        <PageHeader
            title="Customers"
            description="Manage customer accounts and information"
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Customers' }
            ]}
        />
    );
}
