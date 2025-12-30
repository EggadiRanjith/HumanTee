import { OrderStatus, Order, OrderItem, Address, Payment } from '@/app/types/order.types';

export type { OrderStatus, Order, OrderItem, Address, Payment };

export interface OrderFilters {
    status?: OrderStatus | 'all';
    dateRange?: 'all' | 'last-30-days' | 'last-90-days' | 'this-year';
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'price-high' | 'price-low';
    page?: number;
    limit?: number;
}
