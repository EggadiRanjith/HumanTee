/**
 * Orders Header Component
 */

import { PageHeader } from '@/app/components';
import { FiPlus } from 'react-icons/fi';

export function OrdersHeader() {
    return (
        <PageHeader
            title="Orders"
            description="Manage and track all customer orders"
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Orders' }
            ]}
        />
    );
}
