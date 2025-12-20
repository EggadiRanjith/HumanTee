/**
 * Discounts List Page (FRONTEND-ONLY)
 * 
 * RULES:
 * - UI only, no business logic
 * - No price calculation
 * - No checkout simulation
 * - Backend-agnostic but backend-ready
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type DiscountType = 'PERCENT' | 'FLAT';
type DiscountScope = 'PRODUCT' | 'GROUP';
type DiscountStatus = 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'DISABLED';

interface Discount {
    id: string;
    name: string;
    type: DiscountType;
    value: number;
    scope: DiscountScope;
    productsCount: number;
    status: DiscountStatus;
    startAt: Date;
    endAt: Date;
}

// Mock data (UI-only)
const mockDiscounts: Discount[] = [
    {
        id: '1',
        name: 'Diwali Sale',
        type: 'PERCENT',
        value: 20,
        scope: 'GROUP',
        productsCount: 24,
        status: 'ACTIVE',
        startAt: new Date('2024-12-15'),
        endAt: new Date('2024-12-25'),
    },
    {
        id: '2',
        name: 'New Year Offer',
        type: 'FLAT',
        value: 500,
        scope: 'PRODUCT',
        productsCount: 12,
        status: 'SCHEDULED',
        startAt: new Date('2024-12-31'),
        endAt: new Date('2025-01-05'),
    },
    {
        id: '3',
        name: 'Summer Sale',
        type: 'PERCENT',
        value: 15,
        scope: 'GROUP',
        productsCount: 18,
        status: 'EXPIRED',
        startAt: new Date('2024-06-01'),
        endAt: new Date('2024-06-30'),
    },
];

export default function DiscountsListPage() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDiscounts = useMemo(() => {
        let filtered = mockDiscounts;

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((d) => d.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter((d) =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [statusFilter, searchQuery]);

    const getStatusColor = (status: DiscountStatus) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700';
            case 'SCHEDULED':
                return 'bg-blue-100 text-blue-700';
            case 'EXPIRED':
                return 'bg-gray-100 text-gray-700';
            case 'DISABLED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">Discounts</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Manage discount rules and promotions
                    </p>
                </div>
                <Link
                    href="/admin/discounts/new"
                    className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm text-center"
                >
                    + Create Discount
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Search discounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="DISABLED">Disabled</option>
                    </select>
                </div>
            </div>

            {/* Discounts Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Discount Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Type
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Scope
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Duration
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Products
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredDiscounts.map((discount) => (
                            <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">{discount.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-black">
                                        {discount.type === 'PERCENT' ? `${discount.value}%` : `₹${discount.value}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        {discount.scope === 'PRODUCT' ? 'Specific Products' : 'Product Group'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                            discount.status
                                        )}`}
                                    >
                                        {discount.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        {discount.startAt.toLocaleDateString()} → {discount.endAt.toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{discount.productsCount} products</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/discounts/${discount.id}`}
                                        className="text-sm text-black hover:underline font-medium"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Discounts Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {filteredDiscounts.map((discount) => (
                    <div key={discount.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-sm font-medium text-black">{discount.name}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                    {discount.type === 'PERCENT' ? `${discount.value}%` : `₹${discount.value}`} •{' '}
                                    {discount.scope === 'PRODUCT' ? 'Products' : 'Group'}
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(discount.status)}`}
                            >
                                {discount.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                            {discount.startAt.toLocaleDateString()} → {discount.endAt.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600 mb-3">{discount.productsCount} products</div>
                        <Link
                            href={`/admin/discounts/${discount.id}`}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            Edit Discount
                        </Link>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredDiscounts.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">🏷️</div>
                    <h3 className="text-lg font-medium text-black mb-2">No discounts found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {searchQuery || statusFilter !== 'ALL'
                            ? 'Try adjusting your filters'
                            : 'Create your first discount to get started'}
                    </p>
                    {(searchQuery || statusFilter !== 'ALL') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('ALL');
                            }}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
