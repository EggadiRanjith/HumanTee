// @ts-nocheck
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
import { discountsApi } from '@/lib/api/discounts';
import { useAdminDiscounts } from '@/lib/queries/useDiscounts';
import { DiscountsHeader, DiscountsSkeleton, DiscountsEmpty, DiscountsError } from './components';

type DiscountType = 'PERCENT' | 'FLAT';
type DiscountScope = 'GLOBAL' | 'PRODUCT' | 'GROUP';

interface Discount {
    id: string;
    name: string;
    code: string;
    type: DiscountType;
    value: number;
    scope: DiscountScope;
    isActive: boolean;
    startDate: string;
    endDate: string | null;
    productsCount?: number;
    usageCount?: number;
    usageLimit?: number | null;
}

export default function DiscountsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [typeFilter, setTypeFilter] = useState<'ALL' | DiscountType>('ALL');

    // Use React Query hook
    const { data: discounts = [], isLoading, error, refetch } = useAdminDiscounts();

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this discount?')) return;
        try {
            await discountsApi.delete(id);
            alert('Discount deleted successfully!');
            window.location.reload();
        } catch (err) {
            alert('Failed to delete discount');
        }
    };

    const filteredDiscounts = useMemo(() => {
        let filtered = discounts;

        if (statusFilter !== 'ALL') {
            const now = new Date();
            filtered = filtered.filter((d: Discount) => {
                const isExpired = d.endDate && new Date(d.endDate) < now;
                const isScheduled = new Date(d.startDate) > now;
                const isActive = d.isActive && !isExpired && !isScheduled;

                if (statusFilter === 'ACTIVE') return isActive;
                if (statusFilter === 'SCHEDULED') return isScheduled;
                if (statusFilter === 'EXPIRED') return isExpired;
                if (statusFilter === 'DISABLED') return !d.isActive;
                return true;
            });
        }

        if (searchQuery) {
            filtered = filtered.filter((d: Discount) =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [discounts, statusFilter, searchQuery]);

    // NOW conditional returns are safe
    if (isLoading) return <DiscountsSkeleton />;
    if (error) return <DiscountsError error={error} onRetry={() => refetch()} />;
    if (discounts.length === 0) return <DiscountsEmpty />;

    const getStatus = (discount: Discount) => {
        const now = new Date();
        if (!discount.isActive) return { label: 'DISABLED', color: 'bg-red-100 text-red-700' };
        if (discount.endDate && new Date(discount.endDate) < now) return { label: 'EXPIRED', color: 'bg-gray-100 text-gray-700' };
        if (new Date(discount.startDate) > now) return { label: 'SCHEDULED', color: 'bg-blue-100 text-blue-700' };
        return { label: 'ACTIVE', color: 'bg-green-100 text-green-700' };
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
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value)}
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
                                        className={`px-2 py-1 text-xs font-medium rounded ${getStatus(discount).color}`}
                                    >
                                        {getStatus(discount).label}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        {new Date(discount.startDate).toLocaleDateString()} → {discount.endDate ? new Date(discount.endDate).toLocaleDateString() : 'No end'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{discount.productsCount || 0} products</div>
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
                {isLoading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
                        Loading...
                    </div>
                ) : filteredDiscounts.map((discount) => {
                    const status = getStatus(discount);
                    return (
                        <div key={discount.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-sm font-medium text-black">{discount.name}</div>
                                    <div className="text-[10px] font-mono text-gray-400 uppercase mt-0.5">{discount.code}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {discount.type === 'PERCENT' ? `${discount.value}%` : `₹${discount.value}`} •{' '}
                                        {discount.scope}
                                    </div>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}
                                >
                                    {status.label}
                                </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                                {new Date(discount.startDate).toLocaleDateString()}
                                {discount.endDate ? ` → ${new Date(discount.endDate).toLocaleDateString()}` : ' → ∞'}
                            </div>
                            <div className="text-xs text-gray-600 mb-3">
                                Usage: {discount.usedCount || 0} / {discount.globalUsageLimit || '∞'}
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href={`/admin/discounts/${discount.id}`}
                                    className="text-sm text-black hover:underline font-medium"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(discount.id)}
                                    className="text-sm text-red-600 hover:underline font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {!isLoading && filteredDiscounts.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">🏷️</div>
                    <h3 className="text-lg font-medium text-black mb-2">
                        {error ? 'Error loading discounts' : 'No discounts found'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {error ? 'Please try again later' : (searchQuery || statusFilter !== 'ALL'
                            ? 'Try adjusting your filters'
                            : 'Create your first discount to get started')}
                    </p>
                    {(searchQuery || statusFilter !== 'ALL' || error) && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('ALL');
                                fetchDiscounts();
                            }}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            {error ? 'Retry' : 'Clear filters'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
