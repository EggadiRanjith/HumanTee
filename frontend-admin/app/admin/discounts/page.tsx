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

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { discountsApi } from '@/lib/api/discounts';
import { useAdminDiscounts } from '@/lib/queries/useDiscounts';
import { DiscountsSkeleton, DiscountsEmpty, DiscountsError, DiscountCard } from './components';
import { toast } from 'sonner';

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
    // Sanitize search input for security
    const sanitizedSearch = searchQuery.trim().replace(/[<>"']/g, '');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'DISABLED'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Use React Query hook
    const discountsQuery = useAdminDiscounts();
    const { data: discounts = [], isLoading, error } = discountsQuery;
    const refetch = discountsQuery.refetch;

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    const handleDelete = async (id: string) => {
        try {
            await discountsApi.delete(id);
            toast.success('Discount deleted successfully!');
            await refetch();
        } catch (err) {
            toast.error('Failed to delete discount');
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

        if (sanitizedSearch) {
            filtered = filtered.filter((d: Discount) =>
                d.name.toLowerCase().includes(sanitizedSearch.toLowerCase()) ||
                d.code.toLowerCase().includes(sanitizedSearch.toLowerCase())
            );
        }

        return filtered;
    }, [discounts, statusFilter, sanitizedSearch]);

    // Memoized pagination calculations for performance
    const totalPages = useMemo(() =>
        Math.ceil(filteredDiscounts.length / itemsPerPage),
        [filteredDiscounts.length, itemsPerPage]
    );

    const paginatedDiscounts = useMemo(() =>
        filteredDiscounts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ),
        [filteredDiscounts, currentPage, itemsPerPage]
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [sanitizedSearch, statusFilter]);

    // NOW conditional returns are safe
    if (isLoading) return <DiscountsSkeleton />;
    if (error) return <DiscountsError error={error} onRetry={() => refetch()} />;
    // Only show empty state if NO discounts exist (not when filtered)
    if (discounts.length === 0 && !searchQuery && statusFilter === 'ALL') {
        return <DiscountsEmpty />;
    }

    const getStatus = (discount: Discount) => {
        const now = new Date();
        if (!discount.isActive) return { label: 'DISABLED', color: 'bg-red-100 text-red-700' };
        if (discount.endDate && new Date(discount.endDate) < now) return { label: 'EXPIRED', color: 'bg-gray-100 text-gray-700' };
        if (new Date(discount.startDate) > now) return { label: 'SCHEDULED', color: 'bg-blue-100 text-blue-700' };
        return { label: 'ACTIVE', color: 'bg-green-100 text-green-700' };
    };

    return (
        <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Header - Compact Mobile */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 md:gap-3">
                <div>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-black">Discounts</h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Manage discount rules and promotions
                    </p>
                </div>
                <Link
                    href="/admin/discounts/new"
                    className="bg-black hover:bg-gray-900 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-colors text-xs md:text-sm text-center"
                >
                    + Create Discount
                </Link>
            </div>

            {/* Filters - Compact Mobile */}
            <div className="bg-white rounded-lg border border-gray-200 p-2.5 md:p-3 lg:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <input
                        type="text"
                        placeholder="Search discounts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
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
                        {paginatedDiscounts.map((discount: Discount) => (
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

            {/* Discounts Cards (Mobile) - Compact */}
            <div className="lg:hidden space-y-2.5 md:space-y-3">
                {paginatedDiscounts.map((discount: Discount) => (
                    <DiscountCard
                        key={discount.id}
                        discount={discount}
                        onDelete={handleDelete}
                    />
                ))}
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
                                if (error) { void refetch(); }
                            }}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            {error ? 'Retry' : 'Clear filters'}
                        </button>
                    )}
                </div>
            )}

            {/* Pagination - Compact Mobile */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border border-gray-200 p-2.5 md:p-4 gap-3 sm:gap-0">
                    <div className="text-xs md:text-sm text-gray-600 hidden sm:block">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDiscounts.length)} of {filteredDiscounts.length} discounts
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
        </div>
    );
}
