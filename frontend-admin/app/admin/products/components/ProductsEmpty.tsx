/**
 * Products Empty State Component
 */

import { EmptyState } from '@/app/components';
import { useRouter } from 'next/navigation';

export function ProductsEmpty() {
    const router = useRouter();

    return (
        <EmptyState
            title="No products found"
            message="Get started by adding your first product to the catalog."
            icon="📦"
            action={{
                label: 'Add Product',
                onClick: () => router.push('/admin/products/new')
            }}
        />
    );
}
