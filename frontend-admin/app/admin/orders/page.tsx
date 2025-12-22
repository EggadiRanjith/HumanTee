/**
 * Orders List Page (PRODUCTION-GRADE)
 * Features: Real API integration, Search, filters, status badges, responsive layout
 * Mobile: Card view | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/api-client';

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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching admin orders...');
                const response = await apiClient.get('/admin/orders', {
                    params: {
                        status: statusFilter !== 'ALL' ? statusFilter : undefined,
                        search: searchQuery || undefined,
                    }
                });
                console.log('Admin orders response:', response.data);
                setOrders(response.data.orders || []);
            } catch (error: any) {
                console.error('Failed to fetch orders:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error message:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [statusFilter, searchQuery]);

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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (isLoading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">Orders</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Loading...</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black">Orders</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {filteredOrders.length} orders
                </p>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
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
                        onChange={(e) => {
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
            {filteredOrders.length === 0 && !isLoading && (
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
            )}
        </div>
    );
}
