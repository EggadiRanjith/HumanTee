/**
 * Order Types
 * Type definitions for order data
 */

export type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    date: string; // Keep for backward compatibility
    createdAt: string;
    status: OrderStatus;
    total: string; // Keep for backward compatibility
    totalAmount: number;
    items?: any[]; // Array of order items
    tracking?: string | null;
    images?: string[]; // Keep for backward compatibility
}
