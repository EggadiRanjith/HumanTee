/**
 * Dashboard Data Hook
 * Uses React Query for data fetching with caching and automatic refetching
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    paidAmount: number;
    pendingPayments: number;
}

export interface RecentOrder {
    id: string;
    orderNumber: string;
    address: {
        fullName: string;
        email: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
    payments?: Array<{
        status: string;
    }>;
}

interface DashboardData {
    stats: DashboardStats;
    recentOrders: RecentOrder[];
    allOrders: RecentOrder[];
}

export function useDashboardData() {
    const query = useQuery({
        queryKey: ['dashboard'],
        queryFn: async (): Promise<DashboardData> => {
            const response = await apiClient.get('/admin/orders', {
                params: { limit: 100 }
            });

            const orders: RecentOrder[] = response.data.orders || [];

            // Calculate statistics
            const totalOrders = orders.length;
            const pendingOrders = orders.filter((o) =>
                o.status.toLowerCase() === 'pending_payment' || o.status.toLowerCase() === 'pending'
            ).length;
            const processingOrders = orders.filter((o) => o.status.toLowerCase() === 'processing').length;
            const shippedOrders = orders.filter((o) => o.status.toLowerCase() === 'shipped').length;
            const deliveredOrders = orders.filter((o) => o.status.toLowerCase() === 'delivered').length;

            const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            const paidAmount = orders
                .filter((o) => o.payments?.[0]?.status?.toLowerCase() === 'paid')
                .reduce((sum, o) => sum + Number(o.totalAmount), 0);
            const pendingPayments = totalRevenue - paidAmount;

            const stats: DashboardStats = {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                totalRevenue,
                paidAmount,
                pendingPayments,
            };

            return {
                stats,
                recentOrders: orders.slice(0, 5),
                allOrders: orders,
            };
        },
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // Refetch every minute
    });

    return query;
}
