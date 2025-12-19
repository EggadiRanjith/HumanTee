/**
 * Status Configuration
 * Phase 8: Centralized status mapping (backend-driven)
 * CORRECTED: Single source of truth, mirrors backend enums
 */

import { adminTheme } from './theme';

type ProductAction = 'activate' | 'archive';
type OrderAction = 'fulfill' | 'cancel';

interface StatusConfig<T> {
    label: string;
    className: string;
    allowedActions: readonly T[];
}

export const PRODUCT_STATUS_UI: Record<string, StatusConfig<ProductAction>> = {
    DRAFT: {
        label: 'Draft',
        className: adminTheme.status.DRAFT,
        allowedActions: ['activate'],
    },
    ACTIVE: {
        label: 'Active',
        className: adminTheme.status.ACTIVE,
        allowedActions: ['archive'],
    },
    ARCHIVED: {
        label: 'Archived',
        className: adminTheme.status.ARCHIVED,
        allowedActions: [],
    },
};

export const ORDER_STATUS_UI: Record<string, StatusConfig<OrderAction>> = {
    PENDING: {
        label: 'Pending',
        className: adminTheme.status.PENDING,
        allowedActions: [],
    },
    PAID: {
        label: 'Paid',
        className: adminTheme.status.PAID,
        allowedActions: ['fulfill', 'cancel'],
    },
    FULFILLED: {
        label: 'Fulfilled',
        className: adminTheme.status.FULFILLED,
        allowedActions: [],
    },
    CANCELLED_MANUAL: {
        label: 'Cancelled',
        className: adminTheme.status.CANCELLED_MANUAL,
        allowedActions: [],
    },
    FAILED: {
        label: 'Failed',
        className: adminTheme.status.FAILED,
        allowedActions: ['cancel'],
    },
};

export type ProductStatus = keyof typeof PRODUCT_STATUS_UI;
export type OrderStatus = keyof typeof ORDER_STATUS_UI;
