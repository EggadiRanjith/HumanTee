/**
 * Discounts Header Component
 */

import { PageHeader } from '@/app/components';
import { FiPlus } from 'react-icons/fi';

export function DiscountsHeader() {
    return (
        <PageHeader
            title="Discounts"
            description="Manage discount codes and promotions"
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Discounts' }
            ]}
            action={{
                label: 'Create Discount',
                href: '/admin/discounts/new',
                icon: <FiPlus />
            }}
        />
    );
}
