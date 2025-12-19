/**
 * Order Types
 * Type definitions for order data
 */

export type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';

export interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    total: string;
    items: number;
    tracking: string | null;
    images: string[];
}
