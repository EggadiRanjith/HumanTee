// @ts-nocheck
/**
 * Orders List Page (PRODUCTION-GRADE)
 * Features: Real API integration, Search, filters, status badges, responsive layout
 * Mobile: Card view | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useAdminOrders } from '@/lib/queries/useOrders';
import { OrdersHeader, OrdersSkeleton, OrdersEmpty, OrdersError } from './components';

type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed';

interface Order {
    id: string;
    orderNumber: string;
    address: {
        fullName: string;
        email: string;
    };
    items: any[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    payments?: Array<{
        status: string;
    }>;
}

// Helper functions for status display
const getStatusColor = (status: OrderStatus) => {
    const colors = {
        pending_payment: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        payment_failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPaymentStatusColor = (status: string) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const formatStatus = (status: OrderStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};


export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Use React Query hook - automatic caching, refetching, loading states
    const { data, isLoading, error, refetch } = useAdminOrders({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchQuery || undefined,
    });

    const orders = data?.orders || [];

    // Filtered and sorted orders
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // Sort
        filtered = filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                comparison = Number(a.totalAmount) - Number(b.totalAmount);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [orders, sortBy, sortOrder]);

    // Loading state
    if (isLoading) return <OrdersSkeleton />;

    // Error state
    if (error) return <OrdersError error={error} onRetry={() => refetch()} />;

    // Empty state
    if (filteredOrders.length === 0 && !searchQuery && statusFilter === 'ALL') {
        return <OrdersEmpty />;
    }


    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <OrdersHeader />

            {/* Filters & Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e: any) => {
                            const [sort, order] = e.target.value.split('-');
                            setSortBy(sort as typeof sortBy);
                            setSortOrder(order as typeof sortOrder);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="total-desc">Highest Value</option>
                        <option value="total-asc">Lowest Value</option>
                    </select>
                </div>
            </div>

            {/* Orders Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {filteredOrders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="font-mono text-sm font-medium text-black">
                                    {order.orderNumber}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{order.address.fullName}</div>
                                <div className="text-xs text-gray-500">{order.address.email}</div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                    {formatStatus(order.status)}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.payments?.[0]?.status || 'pending')}`}>
                                    {formatStatus(order.payments?.[0]?.status || 'pending')}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <div>
                                <div className="text-sm font-semibold text-black">₹{Number(order.totalAmount).toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{order.items?.length || 0} items</div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Orders Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Order
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Customer
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Order Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Payment Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Total
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Date
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-black">{order.orderNumber}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-black">{order.address.fullName}</div>
                                    <div className="text-xs text-gray-500">{order.address.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                        {formatStatus(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.payments?.[0]?.status || 'pending')}`}>
                                        {formatStatus(order.payments?.[0]?.status || 'pending')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">₹{Number(order.totalAmount).toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">{order.items?.length || 0} items</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-sm text-black hover:underline font-medium"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {
                filteredOrders.length === 0 && !isLoading && (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-black mb-2">No orders found</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('ALL');
                            }}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )
            }
        </div >
    );
}
