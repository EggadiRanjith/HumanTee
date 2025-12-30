// @ts-nocheck
/**
 * Audit Logs Page (PRODUCTION-GRADE)
 * Complete accountability - view all admin actions
 * CRITICAL: This is the accountability layer UI
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuditLogs } from '@/lib/queries/useAuditLogs';
const mockAuditLogs = [
    {
        id: '1',
        adminEmail: 'admin@humantee.com',
        eventType: 'PRODUCT_PRICE_CHANGED',
        entityType: 'product',
        entityId: 'prod_123',
        before: { price: 1299 },
        after: { price: 1499 },
        changes: { price: { from: 1299, to: 1499 } },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2024-12-20T10:30:00'),
    },
    {
        id: '2',
        adminEmail: 'manager@humantee.com',
        eventType: 'ORDER_STATUS_CHANGED',
        entityType: 'order',
        entityId: 'ord_456',
        before: { status: 'PENDING' },
        after: { status: 'FULFILLED' },
        changes: { status: { from: 'PENDING', to: 'FULFILLED' } },
        ipAddress: '192.168.1.2',
        createdAt: new Date('2024-12-20T09:15:00'),
    },
    {
        id: '3',
        adminEmail: 'admin@humantee.com',
        eventType: 'SETTINGS_UPDATED',
        entityType: 'settings',
        entityId: 'settings_1',
        before: { freeShippingThreshold: 1000 },
        after: { freeShippingThreshold: 1500 },
        changes: { freeShippingThreshold: { from: 1000, to: 1500 } },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2024-12-19T16:45:00'),
    },
];

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
    const [entityTypeFilter, setEntityTypeFilter] = useState('ALL');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Use React Query hook - automatic caching and loading states
    const { data: auditLogs = [], isLoading } = useAuditLogs({
        action: eventTypeFilter !== 'ALL' ? eventTypeFilter : undefined,
    });

    // Filtered logs
    const filteredLogs = useMemo(() => {
        let filtered = auditLogs;

        // Search
        if (searchQuery) {
            filtered = filtered.filter(
                (log) =>
                    log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Event type filter
        if (eventTypeFilter !== 'ALL') {
            filtered = filtered.filter((log) => log.eventType === eventTypeFilter);
        }

        // Entity type filter
        if (entityTypeFilter !== 'ALL') {
            filtered = filtered.filter((log) => log.entityType === entityTypeFilter);
        }

        return filtered;
    }, [searchQuery, eventTypeFilter, entityTypeFilter]);

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

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black">Audit Logs</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Complete history of all admin actions
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by admin or entity ID..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Event Type Filter */}
                    <select
                        value={eventTypeFilter}
                        onChange={(e: any) => setEventTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Events</option>
                        <option value="PRODUCT_CREATED">Product Created</option>
                        <option value="PRODUCT_UPDATED">Product Updated</option>
                        <option value="PRODUCT_PRICE_CHANGED">Price Changed</option>
                        <option value="ORDER_STATUS_CHANGED">Order Status Changed</option>
                        <option value="SETTINGS_UPDATED">Settings Updated</option>
                    </select>

                    {/* Entity Type Filter */}
                    <select
                        value={entityTypeFilter}
                        onChange={(e: any) => setEntityTypeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Entities</option>
                        <option value="product">Products</option>
                        <option value="order">Orders</option>
                        <option value="customer">Customers</option>
                        <option value="settings">Settings</option>
                    </select>
                </div>
            </div>

            {/* Audit Logs Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Timestamp
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Admin
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Event
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Entity
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredLogs.map((log) => (
                            <>
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {log.createdAt.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-black">{log.adminEmail}</div>
                                        <div className="text-xs text-gray-500">{log.ipAddress}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded ${getEventTypeColor(
                                                log.eventType
                                            )}`}
                                        >
                                            {log.eventType.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-black">{log.entityType}</div>
                                        <div className="text-xs text-gray-500 font-mono">{log.entityId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleRow(log.id)}
                                            className="text-sm text-black hover:underline font-medium"
                                        >
                                            {expandedRows.has(log.id) ? 'Hide' : 'View'} Changes
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows.has(log.id) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-black">Changes:</div>
                                                {log.changes && Object.entries(log.changes).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="flex items-center gap-4 text-sm">
                                                        <div className="font-medium text-gray-700 min-w-[120px]">
                                                            {key}:
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <code className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                                                {JSON.stringify(value.from)}
                                                            </code>
                                                            <span className="text-gray-500">→</span>
                                                            <code className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                                                {JSON.stringify(value.to)}
                                                            </code>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Audit Logs Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-sm font-medium text-black">{log.adminEmail}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {log.createdAt.toLocaleString()}
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getEventTypeColor(
                                    log.eventType
                                )}`}
                            >
                                {log.eventType.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            {log.entityType}: <span className="font-mono text-xs">{log.entityId}</span>
                        </div>
                        <button
                            onClick={() => toggleRow(log.id)}
                            className="text-sm text-black hover:underline font-medium"
                        >
                            {expandedRows.has(log.id) ? 'Hide' : 'View'} Changes
                        </button>
                        {expandedRows.has(log.id) && (
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                {log.changes && Object.entries(log.changes).map(([key, value]: [string, any]) => (
                                    <div key={key} className="text-sm">
                                        <div className="font-medium text-gray-700 mb-1">{key}:</div>
                                        <div className="flex flex-col gap-1">
                                            <code className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                                From: {JSON.stringify(value.from)}
                                            </code>
                                            <code className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                                To: {JSON.stringify(value.to)}
                                            </code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredLogs.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-black mb-2">No audit logs found</h3>
                    <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setEventTypeFilter('ALL');
                            setEntityTypeFilter('ALL');
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
