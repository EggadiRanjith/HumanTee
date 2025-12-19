/**
 * Badge Component
 * Universal badge component for product labels, status indicators, etc.
 * 
 * @example
 * <Badge variant="sale" />
 * <Badge variant="bestseller" label="Custom Label" />
 */

import { BadgeVariant } from '@/app/types/product.types';
import { BADGE_STYLES, BADGE_LABELS } from '@/app/constants/styles.constants';

interface BadgeProps {
    variant: BadgeVariant;
    label?: string;
    className?: string;
}

export default function Badge({ variant, label, className = '' }: BadgeProps) {
    const badgeLabel = label || BADGE_LABELS[variant];
    const badgeStyles = BADGE_STYLES[variant];

    return (
        <span
            className={`
        rounded-full px-3 py-1
        text-[10px] uppercase tracking-wider font-medium
        ${badgeStyles}
        ${className}
      `}
            role="status"
            aria-label={`${badgeLabel} badge`}
        >
            {badgeLabel}
        </span>
    );
}
