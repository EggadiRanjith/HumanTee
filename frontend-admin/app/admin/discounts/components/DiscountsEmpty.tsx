import { EmptyState } from '@/app/components';
import { useRouter } from 'next/navigation';

export function DiscountsEmpty() {
    const router = useRouter();
    return (
        <EmptyState
            title="No discounts found"
            message="Create your first discount code to start offering promotions."
            icon="🎟️"
            action={{
                label: 'Create Discount',
                onClick: () => router.push('/admin/discounts/new')
            }}
        />
    );
}
