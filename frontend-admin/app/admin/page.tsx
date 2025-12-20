/**
 * Admin Dashboard (ENHANCED)
 * Features: Stats, charts, recent activity, quick actions
 * Mobile-responsive with all key metrics
 */

'use client';

import Link from 'next/link';
import { useMemo } from 'react';

// Mock data
const mockStats = {
    totalOrders: 156,
    pendingOrders: 12,
    totalRevenue: 245680,
    totalProducts: 24,
    activeProducts: 18,
    lowStockProducts: 3,
};

const mockRecentOrders = [
    { id: 'ord_1', orderNumber: 'ORD-001', customer: 'john@example.com', amount: 1299, status: 'PENDING', date: '2025-12-19' },
    { id: 'ord_2', orderNumber: 'ORD-002', customer: 'sarah@example.com', amount: 2499, status: 'PAID', date: '2025-12-19' },
    { id: 'ord_3', orderNumber: 'ORD-003', customer: 'mike@example.com', amount: 1599, status: 'FULFILLED', date: '2025-12-18' },
];

const mockTopProducts = [
    { name: 'Premium Cotton T-Shirt', sales: 45, revenue: 58455 },
    { name: 'Classic Black Hoodie', sales: 32, revenue: 79968 },
    { name: 'Vintage Denim Shirt', sales: 28, revenue: 53172 },
];

const mockRevenueData = [
    { date: '12/14', revenue: 12500 },
    { date: '12/15', revenue: 18200 },
    { date: '12/16', revenue: 15800 },
    { date: '12/17', revenue: 22400 },
    { date: '12/18', revenue: 19600 },
    { date: '12/19', revenue: 25100 },
    { date: '12/20', revenue: 28300 },
];

export default function DashboardPage() {
    const maxRevenue = useMemo(() => Math.max(...mockRevenueData.map(d => d.revenue)), []);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Overview of your store</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">{mockStats.totalOrders}</div>
                    <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Pending Orders</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">{mockStats.pendingOrders}</div>
                    <Link href="/admin/orders?status=PENDING" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        View all →
                    </Link>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">₹{mockStats.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-green-600 mt-1">+18% from last month</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Products</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">{mockStats.totalProducts}</div>
                    <div className="text-xs text-gray-600 mt-1">{mockStats.activeProducts} active</div>
                </div>
            </div>

            {/* Revenue Chart + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-black">Revenue (Last 7 Days)</h2>
                        <div className="text-xs sm:text-sm text-gray-600">₹{mockRevenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</div>
                    </div>
                    <div className="h-48 sm:h-64 flex items-end justify-between gap-2">
                        {mockRevenueData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-black rounded-t" style={{ height: `${(data.revenue / maxRevenue) * 100}%` }} title={`₹${data.revenue.toLocaleString()}`} />
                                <div className="text-xs text-gray-600">{data.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Top Products</h2>
                    <div className="space-y-4">
                        {mockTopProducts.map((product, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="text-sm font-medium text-black line-clamp-2">{product.name}</div>
                                    <div className="text-xs text-gray-600 flex-shrink-0 ml-2">{product.sales} sales</div>
                                </div>
                                <div className="text-xs text-gray-600">₹{product.revenue.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-black">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs sm:text-sm text-black hover:underline">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {mockRecentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders/${order.id}`}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="font-mono text-sm text-black">{order.orderNumber}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">{order.customer}</div>
                                </div>
                                <div className="flex justify-between sm:justify-end sm:text-right gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-black">₹{order.amount}</div>
                                        <div className="text-xs text-gray-600">{order.status}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <Link
                            href="/admin/products/new"
                            className="block w-full bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm text-center"
                        >
                            + Add Product
                        </Link>
                        <Link
                            href="/admin/products"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors text-sm text-center"
                        >
                            View Products
                        </Link>
                        <Link
                            href="/admin/orders?status=PENDING"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors text-sm text-center"
                        >
                            Pending Orders ({mockStats.pendingOrders})
                        </Link>
                    </div>

                    {/* Alerts */}
                    {mockStats.lowStockProducts > 0 && (
                        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-orange-900 mb-1">⚠️ Low Stock Alert</div>
                            <div className="text-xs text-orange-700">{mockStats.lowStockProducts} products running low</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
