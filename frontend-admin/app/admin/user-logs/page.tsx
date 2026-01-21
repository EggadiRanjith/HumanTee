/**
 * User Audit Logs Dashboard
 * Complete user activity tracking - categorized by event type
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useUserAuditLogs } from '@/lib/queries/useUserLogs';
import {
    User,
    ShoppingBag,
    MapPin,
    LogIn,
    CreditCard,
    ChevronRight,
    ArrowLeft,
    Loader2,
    AlertCircle
} from 'lucide-react';

type AuditCategory = 'ALL' | 'AUTH' | 'ORDERS' | 'PAYMENTS' | 'PROFILE' | 'ADDRESSES';

interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    eventType: string;
    entityType: string;
    entityId: string;
    entityName: string;
    before: any;
    after: any;
    changes: any;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
}

export default function UserAuditLogsPage() {
    const [selectedCategory, setSelectedCategory] = useState<AuditCategory>('ALL');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Use React Query hook for user audit logs
    const { data: logs = [], isLoading, error, refetch } = useUserAuditLogs();

    // Category definitions
    const categories = [
        {
            id: 'AUTH' as AuditCategory,
            name: 'Authentication',
            icon: LogIn,
            color: 'bg-green-500',
            events: ['USER_LOGIN', 'USER_LOGOUT', 'USER_TOKEN_REFRESH'],
        },
        {
            id: 'ORDERS' as AuditCategory,
            name: 'Orders',
            icon: ShoppingBag,
            color: 'bg-orange-500',
            events: ['ORDER_CREATED'],
        },
        {
            id: 'PAYMENTS' as AuditCategory,
            name: 'Payments',
            icon: CreditCard,
            color: 'bg-yellow-500',
            events: ['PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED'],
        },
        {
            id: 'PROFILE' as AuditCategory,
            name: 'Profile',
            icon: User,
            color: 'bg-purple-500',
            events: ['PROFILE_UPDATED'],
        },
        {
            id: 'ADDRESSES' as AuditCategory,
            name: 'Addresses',
            icon: MapPin,
            color: 'bg-blue-500',
            events: ['ADDRESS_ADDED', 'ADDRESS_UPDATED', 'ADDRESS_DELETED'],
        },
    ];

    // Calculate counts per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        categories.forEach(cat => {
            counts[cat.id] = (logs || []).filter(log =>
                cat.events.includes(log.eventType)
            ).length;
        });
        return counts;
    }, [logs]);

    // Filtered logs based on selected category and filters
    const filteredLogs = useMemo(() => {
        let filtered = logs || [];

        // Filter by category
        if (selectedCategory !== 'ALL') {
            const category = categories.find(c => c.id === selectedCategory);
            if (category) {
                filtered = filtered.filter(log => category.events.includes(log.eventType));
            }
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(log =>
                log.userEmail.toLowerCase().includes(query) ||
                log.entityId?.toLowerCase().includes(query) ||
                log.entityName?.toLowerCase().includes(query)
            );
        }

        // Filter by event type
        if (eventTypeFilter !== 'ALL') {
            filtered = filtered.filter(log => log.eventType === eventTypeFilter);
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(log => new Date(log.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(log => new Date(log.createdAt) <= end);
        }

        return filtered;
    }, [logs, selectedCategory, searchQuery, eventTypeFilter, startDate, endDate]);

    const toggleRow = (id: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const getEventTypeColor = (eventType: string) => {
        if (eventType.includes('LOGIN')) return 'bg-green-100 text-green-700';
        if (eventType.includes('LOGOUT')) return 'bg-gray-100 text-gray-700';
        if (eventType.includes('ORDER')) return 'bg-orange-100 text-orange-700';
        if (eventType.includes('PAYMENT')) return 'bg-yellow-100 text-yellow-700';
        if (eventType.includes('PROFILE')) return 'bg-purple-100 text-purple-700';
        if (eventType.includes('ADDRESS')) return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading user activity logs...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">Failed to load user logs</h3>
                    <p className="text-sm text-gray-500 mb-4">{error?.message || 'Unknown error'}</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Dashboard view
    if (selectedCategory === 'ALL') {
        return (
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
                {/* Header - Compact Mobile */}
                <div>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-black">User Activity Logs</h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Complete history of all user actions
                    </p>
                </div>

                {/* Category Cards Grid - Compact Mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 md:gap-3 lg:gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const count = categoryCounts[category.id] || 0;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className="bg-white rounded-lg border-2 border-gray-200 p-2.5 md:p-3 lg:p-4 hover:border-black hover:shadow-lg transition-all text-left group"
                            >
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <div className={`${category.color} p-1.5 md:p-2 lg:p-2.5 rounded-lg`}>
                                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-xs md:text-sm mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {count}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Recent Activity - Compact Mobile */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 lg:py-4 border-b border-gray-200">
                        <h2 className="text-sm md:text-base lg:text-lg font-semibold text-black">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {logs.slice(0, 10).map((log) => (
                            <div key={log.id} className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getEventTypeColor(log.eventType)}`}>
                                                {log.eventType.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 truncate">{log.userEmail}</p>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Detailed view
    const currentCategory = categories.find(c => c.id === selectedCategory);
    const Icon = currentCategory?.icon || User;

    return (
        <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Header - Compact Mobile */}
            <div>
                <button
                    onClick={() => setSelectedCategory('ALL')}
                    className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs md:text-sm font-medium transition-colors mb-3 md:mb-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Back
                </button>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className={`${currentCategory?.color} p-1.5 md:p-2 lg:p-2.5 rounded-lg`}>
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-black">{currentCategory?.name}</h1>
                        <p className="text-xs md:text-sm text-gray-600">
                            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters - Compact Mobile */}
            <div className="bg-white rounded-lg border border-gray-200 p-2.5 md:p-3 lg:p-4">
                {/* Search Input */}
                <div className="mb-2 md:mb-3">
                    <input
                        type="text"
                        placeholder="Search by user email, entity ID, or entity name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    {/* Event Type Filter */}
                    <select
                        value={eventTypeFilter}
                        onChange={(e) => setEventTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Events</option>
                        {currentCategory?.events.map(event => (
                            <option key={event} value={event}>
                                {event.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>

                    {/* Start Date */}
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* End Date */}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                </div>

                {/* Clear Filters */}
                {(searchQuery || eventTypeFilter !== 'ALL' || startDate || endDate) && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setEventTypeFilter('ALL');
                            setStartDate('');
                            setEndDate('');
                        }}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear All Filters
                    </button>
                )}
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No audit logs found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                                        Entity
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredLogs.map((log) => (
                                    <React.Fragment key={log.id}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                                <div className="text-xs text-gray-500 lg:hidden">
                                                    {new Date(log.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{log.userEmail}</div>
                                                <div className="text-xs text-gray-500">{log.ipAddress}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getEventTypeColor(log.eventType)}`}>
                                                    {log.eventType.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {log.entityName || `${log.entityType} (${log.entityId?.substring(0, 8)}...)`}
                                                </div>
                                                {log.entityName && log.entityId && (
                                                    <div className="text-xs text-gray-400 font-mono truncate max-w-xs mt-1">
                                                        ID: {log.entityId.substring(0, 8)}...
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <button
                                                    onClick={() => toggleRow(log.id)}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {expandedRows.has(log.id) ? 'Hide Details' : 'View Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRows.has(log.id) && (
                                            <tr>
                                                <td colSpan={5} className="px-4 sm:px-6 py-6 bg-gray-50">
                                                    <div className="space-y-3">
                                                        <div className="text-sm font-semibold text-gray-900 mb-4">Details:</div>
                                                        {log.changes && Object.keys(log.changes).length > 0 ? (
                                                            Object.entries(log.changes).map(([key, value]: [string, any]) => (
                                                                <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 text-sm">
                                                                    <div className="font-semibold text-gray-700 sm:min-w-[140px]">
                                                                        {key}:
                                                                    </div>
                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                        <code className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs break-all">
                                                                            {JSON.stringify(value.from)}
                                                                        </code>
                                                                        <span className="text-gray-400 hidden sm:inline">→</span>
                                                                        <code className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs break-all">
                                                                            {JSON.stringify(value.to)}
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : log.after ? (
                                                            <div className="text-sm text-gray-600">
                                                                <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                                                                    {JSON.stringify(log.after, null, 2)}
                                                                </pre>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500">No additional details available</div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
