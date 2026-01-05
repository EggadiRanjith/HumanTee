/**
 * Audit Logs Dashboard (PRODUCTION-GRADE)
 * Complete accountability - categorized admin action tracking
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useAuditLogs } from '@/lib/queries/useAuditLogs';
import {
    ShoppingBag,
    Package,
    MessageSquare,
    Settings,
    LogIn,
    Tag,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

type AuditCategory = 'ALL' | 'PRODUCTS' | 'ORDERS' | 'TICKETS' | 'DISCOUNTS' | 'SYSTEM' | 'LOGIN';

export default function AuditLogsPage() {
    const [selectedCategory, setSelectedCategory] = useState<AuditCategory>('ALL');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
    const [settingsPageFilter, setSettingsPageFilter] = useState<string>('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const { data: auditLogs = [], isLoading } = useAuditLogs({});

    // Category definitions
    const categories = [
        {
            id: 'PRODUCTS' as AuditCategory,
            name: 'Products',
            icon: Package,
            color: 'bg-blue-500',
            events: ['PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED'],
        },
        {
            id: 'ORDERS' as AuditCategory,
            name: 'Orders',
            icon: ShoppingBag,
            color: 'bg-green-500',
            events: ['ORDER_STATUS_CHANGED', 'ORDER_SHIPMENT_UPDATED'],
        },
        {
            id: 'TICKETS' as AuditCategory,
            name: 'Support',
            icon: MessageSquare,
            color: 'bg-purple-500',
            events: ['TICKET_UPDATED', 'TICKET_REPLIED', 'TICKET_CLOSED'],
        },
        {
            id: 'DISCOUNTS' as AuditCategory,
            name: 'Discounts',
            icon: Tag,
            color: 'bg-pink-500',
            events: ['DISCOUNT_CREATED', 'DISCOUNT_UPDATED', 'DISCOUNT_DELETED'],
        },
        {
            id: 'SYSTEM' as AuditCategory,
            name: 'System',
            icon: Settings,
            color: 'bg-orange-500',
            events: ['SETTINGS_CREATED', 'SETTINGS_UPDATED'],
        },
        {
            id: 'LOGIN' as AuditCategory,
            name: 'Login',
            icon: LogIn,
            color: 'bg-indigo-500',
            events: ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT'],
        },
    ];

    // Calculate counts per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        categories.forEach(cat => {
            counts[cat.id] = auditLogs.filter(log =>
                cat.events.includes(log.eventType)
            ).length;
        });
        return counts;
    }, [auditLogs]);

    // Filtered logs based on selected category
    const filteredLogs = useMemo(() => {
        let filtered = auditLogs;

        // Filter by category
        if (selectedCategory !== 'ALL') {
            const category = categories.find(c => c.id === selectedCategory);
            if (category) {
                filtered = filtered.filter(log => category.events.includes(log.eventType));
            }
        }

        // Filter by specific event type within category
        if (eventTypeFilter !== 'ALL') {
            filtered = filtered.filter(log => log.eventType === eventTypeFilter);
        }

        // Filter by settings page (for System category)
        if (selectedCategory === 'SYSTEM' && settingsPageFilter !== 'ALL') {
            filtered = filtered.filter(log => log.entityName === settingsPageFilter);
        }

        // Search filter - search by entity ID, entity name, or admin email
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(log =>
                log.entityId?.toLowerCase().includes(query) ||
                log.entityName?.toLowerCase().includes(query) ||
                log.adminEmail?.toLowerCase().includes(query)
            );
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(log => new Date(log.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            filtered = filtered.filter(log => new Date(log.createdAt) <= end);
        }

        return filtered;
    }, [auditLogs, selectedCategory, eventTypeFilter, searchQuery, startDate, endDate]);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const getEventTypeColor = (eventType: string) => {
        if (eventType.includes('CREATED')) return 'bg-green-100 text-green-700';
        if (eventType.includes('DELETED')) return 'bg-red-100 text-red-700';
        if (eventType.includes('UPDATED') || eventType.includes('CHANGED')) return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    // Dashboard view
    if (selectedCategory === 'ALL') {
        return (
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">Audit Logs</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Complete history of all admin actions
                    </p>
                </div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const count = categoryCounts[category.id] || 0;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-black hover:shadow-lg transition-all text-left group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`${category.color} p-2.5 rounded-lg`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {count}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base sm:text-lg font-semibold text-black">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {auditLogs.slice(0, 10).map((log) => (
                            <div key={log.id} className="px-4 sm:px-6 py-3 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getEventTypeColor(log.eventType)}`}>
                                                {log.eventType.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 truncate">{log.adminEmail}</p>
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
    const Icon = currentCategory?.icon || Package;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => setSelectedCategory('ALL')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <div className={`${currentCategory?.color} p-2.5 rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-black">{currentCategory?.name}</h1>
                        <p className="text-sm text-gray-600">
                            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Search Input */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Search by entity ID, admin email, or ticket number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Event Type Filter (hidden for System category) */}
                    {selectedCategory !== 'SYSTEM' && (
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
                    )}

                    {/* Settings Page Filter (only for System category) */}
                    {selectedCategory === 'SYSTEM' && (
                        <select
                            value={settingsPageFilter}
                            onChange={(e) => setSettingsPageFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                        >
                            <option value="ALL">All Settings</option>
                            <option value="Header & Footer Settings">Header & Footer</option>
                            <option value="Homepage Settings">Homepage</option>
                            <option value="Product Info Settings">Product Info</option>
                            <option value="Shipping & Taxes Settings">Shipping & Taxes</option>
                            <option value="Maintenance Settings">Maintenance</option>
                        </select>
                    )}

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
                {isLoading ? (
                    <div className="p-12 text-center text-gray-500">Loading audit logs...</div>
                ) : filteredLogs.length === 0 ? (
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
                                        Admin
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
                                                <div className="text-sm font-medium text-gray-900">{log.adminEmail}</div>
                                                <div className="text-xs text-gray-500">{log.ipAddress}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getEventTypeColor(log.eventType)}`}>
                                                    {log.eventType.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {log.entityName || `${log.entityType} (${log.entityId.substring(0, 8)}...)`}
                                                </div>
                                                {log.entityName && (
                                                    <div className="text-xs text-gray-400 font-mono truncate max-w-xs mt-1">
                                                        ID: {log.entityId.substring(0, 8)}...
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                    <button
                                                        onClick={() => toggleRow(log.id)}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {expandedRows.has(log.id) ? 'Hide Changes' : 'View Changes'}
                                                    </button>
                                                    {/* Clickable link to entity - only for non-deleted items */}
                                                    {!log.eventType.includes('DELETED') && (() => {
                                                        let href = '';
                                                        let label = '';
                                                        if (log.entityType === 'product') {
                                                            href = `/admin/products/${log.entityId}`;
                                                            label = 'Go to Product';
                                                        } else if (log.entityType === 'order') {
                                                            href = `/admin/orders/${log.entityId}`;
                                                            label = 'Go to Order';
                                                        } else if (log.entityType === 'ticket') {
                                                            href = `/admin/tickets/${log.entityId}`;
                                                            label = 'Go to Ticket';
                                                        } else if (log.entityType === 'discount') {
                                                            href = `/admin/discounts/${log.entityId}`;
                                                            label = 'Go to Discount';
                                                        }

                                                        return href ? (
                                                            <a
                                                                href={href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline inline-flex items-center gap-1"
                                                            >
                                                                {label}
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(log.id) && (
                                            <tr>
                                                <td colSpan={5} className="px-4 sm:px-6 py-6 bg-gray-50">
                                                    <div className="space-y-3">
                                                        <div className="text-sm font-semibold text-gray-900 mb-4">Changes:</div>
                                                        {log.changes && Object.entries(log.changes).map(([key, value]: [string, any]) => (
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
                                                        ))}
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
