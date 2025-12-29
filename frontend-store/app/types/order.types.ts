/**
 * Order Types
 * Type definitions for order data
 */

export type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled' | 'confirmed';

export interface Order {
    id: string;
    orderNumber: string;
    date?: string; // Optional for backward compatibility
    createdAt: string;
    status: OrderStatus;
    total?: string; // Optional for backward compatibility
    totalAmount: number;
    items?: any[]; // Array of order items
    tracking?: string | null;
    images?: string[]; // Optional for backward compatibility
}
