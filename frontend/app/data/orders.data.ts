/**
 * Orders Data
 * Mock order data for the orders page
 */

import { Order } from '@/app/types/order.types';

export const mockOrders: Order[] = [
    {
        id: "ORD-001",
        date: "Dec 5, 2025",
        status: "delivered",
        total: "$258.00",
        items: 2,
        tracking: "TRK123456789",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
        ],
    },
    {
        id: "ORD-002",
        date: "Dec 7, 2025",
        status: "shipped",
        total: "$129.00",
        items: 1,
        tracking: "TRK987654321",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
        ],
    },
    {
        id: "ORD-003",
        date: "Dec 8, 2025",
        status: "processing",
        total: "$387.00",
        items: 3,
        tracking: null,
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=60&w=600",
        ],
    },
];
