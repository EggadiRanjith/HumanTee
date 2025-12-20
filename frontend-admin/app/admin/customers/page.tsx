/**
 * Customers List Page (PRODUCTION-GRADE)
 * Features: Search, filters, customer stats
 * Mobile: Card view | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// Mock data
const mockCustomers = [
    {
        id: 'cust_1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        totalOrders: 12,
        totalSpent: 45680,
        lastOrderDate: new Date('2024-12-19'),
        createdAt: new Date('2024-06-15'),
    },
    {
        id: 'cust_2',
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '+91 98765 43211',
        totalOrders: 8,
        totalSpent: 32450,
        lastOrderDate: new Date('2024-12-18'),
        createdAt: new Date('2024-07-20'),
    },
    {
        id: 'cust_3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 98765 43212',
        totalOrders: 15,
        totalSpent: 58920,
        lastOrderDate: new Date('2024-12-17'),
        createdAt: new Date('2024-05-10'),
    },
    {
        id: 'cust_4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+91 98765 43213',
        totalOrders: 5,
        totalSpent: 18750,
        lastOrderDate: new Date('2024-12-15'),
        createdAt: new Date('2024-08-25'),
    },
    {
        id: 'cust_5',
        name: 'David Wilson',
        email: 'david@example.com',
        phone: '+91 98765 43214',
        totalOrders: 20,
        totalSpent: 72340,
        lastOrderDate: new Date('2024-12-20'),
        createdAt: new Date('2024-04-05'),
    },
];

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'orders' | 'spent' | 'date'>('spent');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filtered and sorted customers
    const filteredCustomers = useMemo(() => {
        let filtered = mockCustomers;

        // Search
        if (searchQuery) {
            filtered = filtered.filter(
                (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'orders':
                    comparison = a.totalOrders - b.totalOrders;
                    break;
                case 'spent':
                    comparison = a.totalSpent - b.totalSpent;
                    break;
                case 'date':
                    comparison = a.createdAt.getTime() - b.createdAt.getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [searchQuery, sortBy, sortOrder]);

    const totalCustomers = mockCustomers.length;
    const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / mockCustomers.reduce((sum, c) => sum + c.totalOrders, 0);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black">Customers</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {filteredCustomers.length} of {totalCustomers} customers
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Customers</div>
                    <div className="text-2xl font-semibold text-black">{totalCustomers}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-2xl font-semibold text-black">₹{totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600 mb-1">Avg Order Value</div>
                    <div className="text-2xl font-semibold text-black">₹{Math.round(avgOrderValue).toLocaleString()}</div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

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
                        <option value="spent-desc">Highest Spending</option>
                        <option value="spent-asc">Lowest Spending</option>
                        <option value="orders-desc">Most Orders</option>
                        <option value="orders-asc">Least Orders</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Customers Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {filteredCustomers.map((customer) => (
                    <div
                        key={customer.id}
                        className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="font-medium text-black">{customer.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{customer.email}</div>
                                <div className="text-xs text-gray-500">{customer.phone}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                            <div>
                                <div className="text-xs text-gray-600">Total Orders</div>
                                <div className="text-sm font-medium text-black">{customer.totalOrders}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-600">Total Spent</div>
                                <div className="text-sm font-medium text-black">₹{customer.totalSpent.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customers Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Customer
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Contact
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Orders
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Total Spent
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Last Order
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Member Since
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-black">{customer.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{customer.email}</div>
                                    <div className="text-xs text-gray-500">{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{customer.totalOrders}</td>
                                <td className="px-6 py-4 text-sm font-medium text-black">
                                    ₹{customer.totalSpent.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {customer.lastOrderDate.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {customer.createdAt.toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-black mb-2">No customers found</h3>
                    <p className="text-sm text-gray-600 mb-4">Try adjusting your search</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-sm text-black hover:underline font-medium"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
    );
}
