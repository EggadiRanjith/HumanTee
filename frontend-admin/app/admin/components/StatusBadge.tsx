import { PRODUCT_STATUS_UI, ORDER_STATUS_UI, ProductStatus, OrderStatus } from '../config/status';

/**
 * Status Badge Component
 * Phase 8: Status display
 * CORRECTED: Uses centralized status config (single source of truth)
 */

interface StatusBadgeProps {
    status: string;
    type: 'product' | 'order';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
    // CORRECTED: Use centralized config
    const config = type === 'product'
        ? PRODUCT_STATUS_UI[status as ProductStatus]
        : ORDER_STATUS_UI[status as OrderStatus];

    if (!config) {
        return <span className="text-white/60">{status}</span>;
    }

    return (
        <span className={`px-2 py-1 rounded text-sm ${config.className}`}>
            {config.label}
        </span>
    );
}
