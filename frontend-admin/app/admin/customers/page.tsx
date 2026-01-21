'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAdminCustomers } from '@/lib/queries/useCustomers';
import { useDebounce } from '../hooks/useDebounce';
import { CustomersHeader, CustomersSkeleton, CustomersEmpty, CustomersError, CustomerCard } from './components';
import {
    FiSearch, FiFilter, FiLoader, FiUser,
    FiShoppingBag, FiCalendar, FiArrowRight,
    FiTrendingUp, FiUserPlus, FiDollarSign
} from 'react-icons/fi';

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    // Sanitize search input for security
    const sanitizedSearch = searchQuery.trim().replace(/[<>"']/g, '');
    const debouncedSearch = useDebounce(sanitizedSearch, 300);
    const [sort, setSort] = useState('newest');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Use React Query hook
    const { data, isLoading, error, refetch } = useAdminCustomers({
        search: debouncedSearch || undefined,
    });

    const customers = data || [];

    // Apply filters
    const filteredCustomers = useMemo(() => {
        let filtered = [...customers];

        // Apply active filter
        if (activeFilter === 'new') {
            // Last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filtered = filtered.filter(c => new Date(c.created_at) >= thirtyDaysAgo);
        } else if (activeFilter === 'top') {
            // Top 10 highest spenders - FIXED: now returns correctly
            // Sort by totalSpend descending and take top 10
            filtered = [...filtered]
                .sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0))
                .slice(0, 10);
            // Return early to prevent re-sorting
            return filtered;
        }

        // Apply sorting
        if (activeFilter !== 'top') { // Don't re-sort if already sorted by spend
            if (sort === 'newest') {
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            } else if (sort === 'oldest') {
                filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            } else if (sort === 'most_orders') {
                filtered.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
            } else if (sort === 'highest_spend') {
                filtered.sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0));
            }
        }

        return filtered;
    }, [customers, activeFilter, sort]);

    // Memoized pagination calculations for performance
    const totalPages = useMemo(() =>
        Math.ceil(filteredCustomers.length / itemsPerPage),
        [filteredCustomers.length, itemsPerPage]
    );

    const paginatedCustomers = useMemo(() =>
        filteredCustomers.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ),
        [filteredCustomers, currentPage, itemsPerPage]
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, activeFilter]);

    // Loading state
    if (isLoading) return <CustomersSkeleton />;

    // Error state
    if (error) return <CustomersError error={error} onRetry={() => refetch()} />;

    // Empty state - ONLY show if truly no customers from API (not filtered/searched)
    if (customers.length === 0 && !searchQuery && activeFilter === 'all') {
        return <CustomersEmpty />;
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-black">Customers</h1>
                    <p className="text-gray-500 text-xs md:text-sm">Manage and view your customer base</p>
                </div>
            </div>

            {/* Quick Stats / Filters - Compact Mobile, Original Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`p-2 md:p-4 rounded-lg md:rounded-xl border transition-all ${activeFilter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <FiUser className="w-3.5 h-3.5 md:w-5 md:h-5" />
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest opacity-60 md:hidden">All Users</span>
                        </div>
                        <p className="text-xs md:text-lg font-bold">Total Directory</p>
                    </div>
                    <div className="hidden md:flex items-center justify-between mb-2">
                        <FiUser className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">All Users</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveFilter('new')}
                    className={`p-2 md:p-4 rounded-lg md:rounded-xl border transition-all ${activeFilter === 'new' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <FiUserPlus className="w-3.5 h-3.5 md:w-5 md:h-5" />
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest opacity-60 md:hidden">Last 30 Days</span>
                        </div>
                        <p className="text-xs md:text-lg font-bold">New Registrations</p>
                    </div>
                    <div className="hidden md:flex items-center justify-between mb-2">
                        <FiUserPlus className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Last 30 Days</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveFilter('top')}
                    className={`p-2 md:p-4 rounded-lg md:rounded-xl border transition-all ${activeFilter === 'top' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <FiTrendingUp className="w-3.5 h-3.5 md:w-5 md:h-5" />
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest opacity-60 md:hidden">Top 10</span>
                        </div>
                        <p className="text-xs md:text-lg font-bold">Highest Spenders</p>
                    </div>
                    <div className="hidden md:flex items-center justify-between mb-2">
                        <FiTrendingUp className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Top 10</span>
                    </div>
                </button>
            </div>

            {/* Filters Bar - Compact */}
            <div className="flex flex-col md:flex-row gap-2 bg-white p-2.5 rounded-lg border border-gray-200">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-black transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-black transition-all cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most_orders">Most Orders</option>
                        <option value="highest_spend">Highest Spend</option>
                    </select>
                </div>
            </div>

            {/* Desktop: Table */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Orders</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Total Spend</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FiLoader className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                                    {customer.profile?.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-black">{customer.profile?.full_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-500">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-700">{customer.orderCount} orders</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiDollarSign className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm font-bold text-black">₹{customer.totalSpend.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-500">
                                                    {new Date(customer.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/customers/${customer.id}`}>
                                                <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all border border-transparent hover:shadow-lg">
                                                    <FiArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile: Cards - Maximum Spacing */}
            <div className="lg:hidden space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <FiLoader className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : customers.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 text-sm">
                        No customers found.
                    </div>
                ) : (
                    paginatedCustomers.map((customer: any) => (
                        <CustomerCard key={customer.id} customer={customer} />
                    ))
                )}
            </div>

            {/* Pagination - Compact */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-2.5">
                    <div className="text-xs text-gray-600 hidden sm:block">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
                    </div>
                    <div className="flex gap-1.5 mx-auto sm:mx-0">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Prev
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
                                        className={`px-2.5 py-1 border rounded-lg text-xs ${currentPage === page
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
                            className="px-2.5 py-1 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
