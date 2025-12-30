/**
 * Products Header Component
 */

import { PageHeader } from '@/app/components';
import { FiPlus } from 'react-icons/fi';

export function ProductsHeader() {
    return (
        <PageHeader
            title="Products"
            description="Manage your product catalog"
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Products' }
            ]}
            action={{
                label: 'Add Product',
                href: '/admin/products/new',
                icon: <FiPlus />
            }}
        />
    );
}
