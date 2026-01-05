/**
 * User Audit Logs Page
 * Shows all user-related logs for admin monitoring
 * Features: Login attempts, security events, user actions
 */

'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiUser, FiShield } from 'react-icons/fi';

export default function UserAuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateRange, setDateRange] = useState('7d');

    // Sanitize search input
    const sanitizedSearch = searchQuery.trim().replace(/[<>"']/g, '');

    // Fetch login audit logs
    const { data: loginLogs = [], isLoading } = useQuery({
        queryKey: ['user-audit-logs', dateRange],
        queryFn: async () => {
            const response = await apiClient.get('/admin/user-audit-logs', {
                params: { dateRange }
            });
            return response.data;
        },
        staleTime: 30 * 1000, // 30 seconds
    });

    // Filter logs
    const filteredLogs = useMemo(() => {
        let filtered = loginLogs;

        // Search filter
        if (sanitizedSearch) {
            filtered = filtered.filter((log: any) =>
                log.user?.email?.toLowerCase().includes(sanitizedSearch.toLowerCase()) ||
                log.ip_address?.toLowerCase().includes(sanitizedSearch.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter === 'SUCCESS') {
            filtered = filtered.filter((log: any) => log.success === true);
        } else if (statusFilter === 'FAILED') {
            filtered = filtered.filter((log: any) => log.success === false);
        }

        return filtered;
    }, [loginLogs, sanitizedSearch, statusFilter]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = loginLogs.length;
        const successful = loginLogs.filter((log: any) => log.success).length;
        const failed = loginLogs.filter((log: any) => !log.success).length;
        const uniqueUsers = new Set(loginLogs.map((log: any) => log.user?.email).filter(Boolean)).size;

        return { total, successful, failed, uniqueUsers };
    }, [loginLogs]);

    const getStatusIcon = (success: boolean) => {
        return success ? (
            <FiCheckCircle className="w-5 h-5 text-green-600" />
        ) : (
            <FiXCircle className="w-5 h-5 text-red-600" />
        );
    };

    const getStatusBadge = (success: boolean) => {
        return success ? (
            <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                Success
            </span>
        ) : (
            <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                Failed
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-black">User Audit Logs</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Monitor user login attempts and security events
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Total Attempts</span>
                    </div>
                    <div className="text-2xl font-bold text-black">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Successful</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FiXCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Failed</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FiShield className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">Unique Users</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{stats.uniqueUsers}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by email or IP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="SUCCESS">Successful Only</option>
                        <option value="FAILED">Failed Only</option>
                    </select>

                    {/* Date Range */}
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="1d">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Status</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">User</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">IP Address</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Device</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredLogs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(log.success)}
                                        {getStatusBadge(log.success)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">
                                        {log.user?.email || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {log.user?.profile?.full_name || 'No name'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-mono text-gray-900">{log.ip_address}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-600 max-w-xs truncate" title={log.user_agent}>
                                        {log.user_agent || 'Unknown'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {new Date(log.created_at).toLocaleString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {filteredLogs.map((log: any) => (
                    <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(log.success)}
                                <div>
                                    <div className="text-sm font-medium text-black">
                                        {log.user?.email || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(log.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            {getStatusBadge(log.success)}
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">IP Address:</span>
                                <span className="font-mono text-gray-900">{log.ip_address}</span>
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                                Device: {log.user_agent || 'Unknown'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredLogs.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">No logs found</h3>
                    <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
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
