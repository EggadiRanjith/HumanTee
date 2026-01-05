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

    // Memoized pagination calculations for performance
    const totalPages = useMemo(() =>
        Math.ceil(customers.length / itemsPerPage),
        [customers.length, itemsPerPage]
    );

    const paginatedCustomers = useMemo(() =>
        customers.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ),
        [customers, currentPage, itemsPerPage]
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, activeFilter]);

    // Loading state
    if (isLoading) return <CustomersSkeleton />;

    // Error state
    if (error) return <CustomersError error={error} onRetry={() => refetch()} />;

    // Empty state
    if (customers.length === 0) return <CustomersEmpty />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">Customers</h1>
                    <p className="text-gray-500 text-sm">Manage and view your customer base</p>
                </div>
            </div>

            {/* Quick Stats / Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`p-4 rounded-xl border transition-all text-left ${activeFilter === 'all' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <FiUser className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">All Users</span>
                    </div>
                    <p className="text-lg font-bold">Total Directory</p>
                </button>
                <button
                    onClick={() => setActiveFilter('new')}
                    className={`p-4 rounded-xl border transition-all text-left ${activeFilter === 'new' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <FiUserPlus className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Last 30 Days</span>
                    </div>
                    <p className="text-lg font-bold">New Registrations</p>
                </button>
                <button
                    onClick={() => setActiveFilter('top')}
                    className={`p-4 rounded-xl border transition-all text-left ${activeFilter === 'top' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <FiTrendingUp className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Top 10</span>
                    </div>
                    <p className="text-lg font-bold">Highest Spenders</p>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 md:py-2 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-sm text-base focus:outline-none focus:border-black transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black transition-all cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most_orders">Most Orders</option>
                        <option value="highest_spend">Highest Spend</option>
                    </select>
                </div>
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Orders</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Spend</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Action</th>
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

            {/* Mobile: Cards */}
            <div className="md:hidden space-y-3">
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, customers.length)} of {customers.length} customers
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
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
                                        className={`px-3 py-1 border rounded-lg text-sm ${currentPage === page
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
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
