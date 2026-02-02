/**
 * Audit Logs Dashboard (PRODUCTION-GRADE)
 * Complete accountability - categorized admin action tracking
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuditLogs } from '@/lib/queries/useAuditLogs';
import { FeatureDisabledModal } from '@/components/modals/FeatureDisabledModal';
import { getSystemFeatures } from '@/lib/api/system-features';
import {
    ShoppingBag,
    Package,
    MessageSquare,
    Settings,
    LogIn,
    Tag,
    ChevronRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';

type AuditCategory = 'ALL' | 'PRODUCTS' | 'ORDERS' | 'TICKETS' | 'DISCOUNTS' | 'SYSTEM' | 'LOGIN';

interface AuditLog {
    id: string;
    adminEmail: string;
    eventType: string;
    entityType: string;
    entityId: string;
    entityName: string;
    before: any;
    after: any;
    changes: any;
    ipAddress: string;
    userAgent?: string;
    createdAt: string;
}

export default function AuditLogsPage() {
    const [selectedCategory, setSelectedCategory] = useState<AuditCategory>('ALL');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
    const [settingsPageFilter, setSettingsPageFilter] = useState<string>('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [auditLogsEnabled, setAuditLogsEnabled] = useState(true);
    const [auditLogsDisabledSince, setAuditLogsDisabledSince] = useState<string>();

    const { data: auditLogs = [], isLoading } = useAuditLogs({});

    // Check if audit logs are enabled
    useEffect(() => {
        async function checkFeatures() {
            try {
                const features = await getSystemFeatures();
                setAuditLogsEnabled(features.adminAuditLogsEnabled);
                setAuditLogsDisabledSince(features.adminAuditLogsDisabledSince);
            } catch (error) {
                // Ignore error, assume enabled
            }
        }
        checkFeatures();
    }, []);

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
            counts[cat.id] = auditLogs.filter((log: AuditLog) =>
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
                filtered = filtered.filter((log: AuditLog) => category.events.includes(log.eventType));
            }
        }

        // Filter by specific event type within category
        if (eventTypeFilter !== 'ALL') {
            filtered = filtered.filter((log: AuditLog) => log.eventType === eventTypeFilter);
        }

        // Filter by settings page (for System category)
        if (selectedCategory === 'SYSTEM' && settingsPageFilter !== 'ALL') {
            filtered = filtered.filter((log: AuditLog) => log.entityName === settingsPageFilter);
        }

        // Search filter - search by entity ID, entity name, or admin email
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((log: AuditLog) =>
                log.entityId?.toLowerCase().includes(query) ||
                log.entityName?.toLowerCase().includes(query) ||
                log.adminEmail?.toLowerCase().includes(query)
            );
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter((log: AuditLog) => new Date(log.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            filtered = filtered.filter((log: AuditLog) => new Date(log.createdAt) <= end);
        }

        return filtered;
    }, [auditLogs, selectedCategory, eventTypeFilter, settingsPageFilter, searchQuery, startDate, endDate]);

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
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
                {/* Feature Disabled Modal */}
                {!auditLogsEnabled && (
                    <FeatureDisabledModal
                        featureName="Audit Logs"
                        disabledSince={auditLogsDisabledSince}
                        message="Audit logging has been disabled. No admin or user actions are being tracked during this period."
                        settingsPath="/admin/settings/system"
                    />
                )}

                {/* Header - Compact Mobile */}
                <div>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-black">Audit Logs</h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                        Complete history of all admin actions
                    </p>
                </div>

                {/* Category Cards Grid - Compact Mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 md:gap-3 lg:gap-4">
                    {isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="bg-white rounded-lg border-2 border-gray-200 p-2.5 md:p-3 lg:p-4 animate-pulse">
                                <div className="flex items-center justify-between mb-2 md:mb-3">
                                    <div className="bg-gray-200 p-1.5 md:p-2 lg:p-2.5 rounded-lg w-10 h-10"></div>
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-12"></div>
                            </div>
                        ))
                    ) : (
                        categories.map((category) => {
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
                        })
                    )}
                </div>

                {/* Recent Activity - Compact Mobile */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 lg:py-4 border-b border-gray-200">
                        <h2 className="text-sm md:text-base lg:text-lg font-semibold text-black">Recent Activity</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, idx) => (
                                <div key={idx} className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 animate-pulse">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            auditLogs.slice(0, 10).map((log: AuditLog) => (
                                <div key={log.id} className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition-colors">
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Detailed view
    const currentCategory = categories.find(c => c.id === selectedCategory);
    const Icon = currentCategory?.icon || Package;

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
                        placeholder="Search by entity ID, admin email, or ticket number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                    {/* Event Type Filter (hidden for System category) */}
                    {selectedCategory !== 'SYSTEM' && (
                        <select
                            value={eventTypeFilter}
                            onChange={(e) => setEventTypeFilter(e.target.value)}
                            className="px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
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
                        className="px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* End Date */}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                        className="px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
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
                    <div className="p-12 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">Loading audit logs...</p>
                    </div>
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredLogs.map((log: AuditLog) => (
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
                                                {log.eventType.includes('LOGIN') || log.eventType.includes('LOGOUT') ? (
                                                    <>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {log.after?.loginMethod || 'Unknown Method'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate max-w-xs mt-1">
                                                            {log.userAgent || 'Unknown Device'}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {log.entityName || `${log.entityType} (${log.entityId.substring(0, 8)}...)`}
                                                        </div>
                                                        {log.entityName && (
                                                            <div className="text-xs text-gray-400 font-mono truncate max-w-xs mt-1">
                                                                ID: {log.entityId.substring(0, 8)}...
                                                            </div>
                                                        )}
                                                    </>
                                                )}
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
