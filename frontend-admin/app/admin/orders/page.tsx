/**
 * Orders List Page (PRODUCTION-GRADE)
 * Features: Real API integration, Search, filters, status badges, responsive layout
 * Mobile: Card view | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
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
        providerPaymentId?: string;
        providerOrderId?: string;
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
        initiated: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        authorized: 'bg-blue-100 text-blue-800',
        captured: 'bg-green-100 text-green-800',
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Use React Query hook - automatic caching, refetching, loading states
    const { data, isLoading, error, refetch } = useAdminOrders({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchQuery || undefined,
    });

    const orders = data?.orders || [];

    // Sort orders (backend already filtered by status)
    const sortedOrders = useMemo(() => {
        let sorted = [...orders];

        // Sort
        sorted = sorted.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                comparison = Number(a.totalAmount) - Number(b.totalAmount);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [orders, sortBy, sortOrder]);

    // Paginated orders
    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    // Loading state
    if (isLoading) return <OrdersSkeleton />;

    // Error state
    if (error) return <OrdersError error={error} onRetry={() => refetch()} />;

    // Empty state
    if (sortedOrders.length === 0 && !searchQuery && statusFilter === 'ALL') {
        return <OrdersEmpty />;
    }


    return (
        <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Header */}
            <OrdersHeader />

            {/* Filters & Search - Compact Mobile */}
            <div className="bg-white rounded-lg border border-gray-200 p-2.5 md:p-3 lg:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
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
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="total-desc">Highest Value</option>
                        <option value="total-asc">Lowest Value</option>
                    </select>
                </div>
            </div>

            {/* Orders Cards (Mobile) - Compact */}
            <div className="lg:hidden space-y-2.5 md:space-y-3">
                {paginatedOrders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="block bg-white rounded-lg border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                            <div>
                                <div className="font-mono text-xs md:text-sm font-medium text-black">
                                    {order.orderNumber}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600 mt-1">{order.address.fullName}</div>
                                <div className="text-[10px] md:text-xs text-gray-500">{order.address.email}</div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                    {formatStatus(order.status)}
                                </span>
                                <span className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded ${getPaymentStatusColor(order.payments?.[0]?.status || 'initiated')}`}>
                                    {order.payments?.[0]?.status === 'captured' ? '✅ ' : ''}{formatStatus(order.payments?.[0]?.status || 'initiated')}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-gray-200">
                            <div>
                                <div className="text-xs md:text-sm font-semibold text-black">₹{Number(order.totalAmount).toLocaleString()}</div>
                                <div className="text-[10px] md:text-xs text-gray-500">{order.items?.length || 0} items</div>
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500">
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
                        {paginatedOrders.map((order) => (
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
                                    <div className="flex flex-col gap-1">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.payments?.[0]?.status || 'initiated')}`}>
                                            {order.payments?.[0]?.status === 'captured' ? '✅ ' : ''}{formatStatus(order.payments?.[0]?.status || 'initiated')}
                                        </span>
                                        {order.payments?.[0]?.providerPaymentId && (
                                            <code className="text-[10px] text-gray-500 font-mono">
                                                {order.payments[0].providerPaymentId.substring(0, 20)}...
                                            </code>
                                        )}
                                    </div>
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

            {/* Pagination - Compact Mobile */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border border-gray-200 p-2.5 md:p-4 gap-3 sm:gap-0">
                    <div className="text-xs md:text-sm text-gray-600 hidden sm:block">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 md:px-3 py-1 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">←</span>
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let page;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-2.5 md:px-3 py-1 border rounded-lg text-xs md:text-sm ${currentPage === page
                                            ? 'bg-black text-white border-black'
                                            : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2.5 md:px-3 py-1 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {
                sortedOrders.length === 0 && !isLoading && (
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
