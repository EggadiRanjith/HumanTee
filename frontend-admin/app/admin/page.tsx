/**
 * Admin Dashboard (REFACTORED)
 * Clean, modular dashboard using extracted components
 * Mobile-responsive with improved layout
 */

'use client';

import { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCharts } from './components/DashboardPieCharts';
import { RecentOrdersList } from './components/RecentOrdersList';
import { QuickActions } from './components/QuickActions';

export default function DashboardPage() {
    const { data, isLoading, error, refetch, isFetching } = useDashboardData();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch({ cancelRefetch: true });
        // Minimum 500ms loading to show feedback
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const stats = data?.stats || {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        paidAmount: 0,
        pendingPayments: 0,
    };

    const recentOrders = data?.recentOrders || [];
    const allOrders = data?.allOrders || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Failed to load dashboard</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-black">Dashboard</h1>
                    <p className="text-sm text-gray-600 mt-1">Overview of your store</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isRefreshing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            🔄 Refresh
                        </>
                    )}
                </button>
            </div>

            {/* Stats Grid */}
            <DashboardStats stats={stats} />

            {/* Charts - Orders & Revenue Over Time */}
            <DashboardCharts orders={allOrders} />

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-lg font-semibold text-black mb-4">Order Status</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-sm text-gray-700">Pending</span>
                            </div>
                            <span className="text-sm font-medium text-black">{stats.pendingOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-700">Processing</span>
                            </div>
                            <span className="text-sm font-medium text-black">{stats.processingOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-700">Shipped</span>
                            </div>
                            <span className="text-sm font-medium text-black">{stats.shippedOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-700">Delivered</span>
                            </div>
                            <span className="text-sm font-medium text-black">{stats.deliveredOrders}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-lg font-semibold text-black mb-4">Payment Overview</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Paid Amount</span>
                                <span className="text-sm font-medium text-green-600">₹{stats.paidAmount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all"
                                    style={{ width: `${stats.totalRevenue > 0 ? (stats.paidAmount / stats.totalRevenue) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Pending Payments</span>
                                <span className="text-sm font-medium text-yellow-600">₹{stats.pendingPayments.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full transition-all"
                                    style={{ width: `${stats.totalRevenue > 0 ? (stats.pendingPayments / stats.totalRevenue) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentOrdersList orders={recentOrders} />
                <div className="lg:sticky lg:top-4 lg:self-start">
                    <QuickActions stats={stats} />
                </div>
            </div>
        </div>
    );
}
