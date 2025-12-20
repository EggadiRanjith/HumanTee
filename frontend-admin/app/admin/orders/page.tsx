/**
 * Orders List Page (PRODUCTION-GRADE)
 * Features: Search, filters, status badges, responsive layout
 * Mobile: Card view | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// Mock data
const mockOrders = [
    {
        id: 'ord_1a2b3c4d',
        orderNumber: 'ORD-001',
        customer: {
            name: 'John Doe',
            email: 'john@example.com',
        },
        items: 3,
        total: 3897,
        status: 'PENDING' as const,
        paymentStatus: 'PENDING' as const,
        createdAt: new Date('2024-12-19T10:30:00'),
    },
    {
        id: 'ord_2b3c4d5e',
        orderNumber: 'ORD-002',
        customer: {
            name: 'Sarah Smith',
            email: 'sarah@example.com',
        },
        items: 2,
        total: 2499,
        status: 'FULFILLED' as const,
        paymentStatus: 'PAID' as const,
        createdAt: new Date('2024-12-18T14:20:00'),
    },
    {
        id: 'ord_3c4d5e6f',
        orderNumber: 'ORD-003',
        customer: {
            name: 'Mike Johnson',
            email: 'mike@example.com',
        },
        items: 1,
        total: 1299,
        status: 'PROCESSING' as const,
        paymentStatus: 'PAID' as const,
        createdAt: new Date('2024-12-18T09:15:00'),
    },
    {
        id: 'ord_4d5e6f7g',
        orderNumber: 'ORD-004',
        customer: {
            name: 'Emily Davis',
            email: 'emily@example.com',
        },
        items: 4,
        total: 5196,
        status: 'CANCELLED' as const,
        paymentStatus: 'REFUNDED' as const,
        createdAt: new Date('2024-12-17T16:45:00'),
    },
    {
        id: 'ord_5e6f7g8h',
        orderNumber: 'ORD-005',
        customer: {
            name: 'David Wilson',
            email: 'david@example.com',
        },
        items: 2,
        total: 3798,
        status: 'FULFILLED' as const,
        paymentStatus: 'PAID' as const,
        createdAt: new Date('2024-12-17T11:30:00'),
    },
];

type OrderStatus = 'PENDING' | 'PROCESSING' | 'FULFILLED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filtered and sorted orders
    const filteredOrders = useMemo(() => {
        let filtered = mockOrders;

        // Search
        if (searchQuery) {
            filtered = filtered.filter(
                (o) =>
                    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((o) => o.status === statusFilter);
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = a.createdAt.getTime() - b.createdAt.getTime();
            } else {
                comparison = a.total - b.total;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [searchQuery, statusFilter, sortBy, sortOrder]);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-700';
            case 'FULFILLED':
                return 'bg-green-100 text-green-700';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700';
        }
    };

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-gray-100 text-gray-700';
            case 'PAID':
                return 'bg-green-100 text-green-700';
            case 'FAILED':
                return 'bg-red-100 text-red-700';
            case 'REFUNDED':
                return 'bg-orange-100 text-orange-700';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black">Orders</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {filteredOrders.length} of {mockOrders.length} orders
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
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="FULFILLED">Fulfilled</option>
                        <option value="CANCELLED">Cancelled</option>
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
                                <div className="text-sm text-gray-600 mt-1">{order.customer.name}</div>
                                <div className="text-xs text-gray-500">{order.customer.email}</div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <div>
                                <div className="text-sm font-semibold text-black">₹{order.total.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{order.items} items</div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {order.createdAt.toLocaleDateString()}
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
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Payment
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
                                    <div className="text-sm text-black">{order.customer.name}</div>
                                    <div className="text-xs text-gray-500">{order.customer.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">₹{order.total.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">{order.items} items</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {order.createdAt.toLocaleDateString()}
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
            {filteredOrders.length === 0 && (
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
