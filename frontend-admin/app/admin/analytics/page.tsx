/**
 * Analytics Dashboard (PRODUCTION-GRADE)
 * Features: Revenue charts, metrics, top performers
 * Mobile-responsive with date range selector
 */

'use client';

import { useState, useMemo } from 'react';
import { useAnalytics } from '@/lib/queries/useAnalytics';
const mockMetrics = {
    totalRevenue: 245680,
    totalOrders: 156,
    avgOrderValue: 1575,
    conversionRate: 3.2,
    revenueGrowth: 18.5,
    ordersGrowth: 12.3,
};

const mockRevenueByDay = [
    { date: '12/14', revenue: 12500, orders: 8 },
    { date: '12/15', revenue: 18200, orders: 12 },
    { date: '12/16', revenue: 15800, orders: 10 },
    { date: '12/17', revenue: 22400, orders: 14 },
    { date: '12/18', revenue: 19600, orders: 13 },
    { date: '12/19', revenue: 25100, orders: 16 },
    { date: '12/20', revenue: 28300, orders: 18 },
];

const mockTopProducts = [
    { name: 'Premium Cotton T-Shirt', revenue: 58455, orders: 45 },
    { name: 'Classic Black Hoodie', revenue: 79968, orders: 32 },
    { name: 'Vintage Denim Shirt', revenue: 53172, orders: 28 },
    { name: 'Oversized Sweatshirt', revenue: 43780, orders: 20 },
    { name: 'Summer Polo Collection', revenue: 31950, orders: 21 },
];

const mockTopCustomers = [
    { name: 'David Wilson', email: 'david@example.com', spent: 72340, orders: 20 },
    { name: 'Mike Johnson', email: 'mike@example.com', spent: 58920, orders: 15 },
    { name: 'John Doe', email: 'john@example.com', spent: 45680, orders: 12 },
    { name: 'Sarah Smith', email: 'sarah@example.com', spent: 32450, orders: 8 },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('7d');

    // Use React Query hook - automatic caching and loading states
    const { data, isLoading } = useAnalytics(dateRange);

    // Use data from API or fallback to empty objects
    const mockMetrics = data?.metrics || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, conversionRate: 0, revenueGrowth: 0, ordersGrowth: 0 };
    const mockRevenueByDay = data?.revenueByDay || [];
    const mockTopProducts = data?.topProducts || [];
    const mockTopCustomers = data?.topCustomers || [];

    const maxRevenue = useMemo(() => Math.max(...mockRevenueByDay.map((d: any) => d.revenue), 1), [mockRevenueByDay]);
    const maxOrders = useMemo(() => Math.max(...mockRevenueByDay.map((d: any) => d.orders), 1), [mockRevenueByDay]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">Analytics</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Performance insights and metrics</p>
                </div>
                <select
                    value={dateRange}
                    onChange={(e: any) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">₹{mockMetrics.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-green-600 mt-1">+{mockMetrics.revenueGrowth}%</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">{mockMetrics.totalOrders}</div>
                    <div className="text-xs text-green-600 mt-1">+{mockMetrics.ordersGrowth}%</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Avg Order Value</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">₹{mockMetrics.avgOrderValue}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Conversion Rate</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">{mockMetrics.conversionRate}%</div>
                </div>
            </div>

            {/* Revenue & Orders Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Revenue Trend</h2>
                    <div className="h-48 sm:h-64 flex items-end justify-between gap-2">
                        {mockRevenueByDay.map((data: typeof mockRevenueByDay[0], index: number) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-black rounded-t hover:bg-gray-800 transition-colors cursor-pointer"
                                    style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                                    title={`₹${data.revenue.toLocaleString()}`}
                                />
                                <div className="text-xs text-gray-600">{data.date}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Total: ₹{mockRevenueByDay.reduce((sum: number, d: typeof mockRevenueByDay[0]) => sum + d.revenue, 0).toLocaleString()}
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Orders Trend</h2>
                    <div className="h-48 sm:h-64 flex items-end justify-between gap-2">
                        {mockRevenueByDay.map((data: any, index: number) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer"
                                    style={{ height: `${(data.orders / maxOrders) * 100}%` }}
                                    title={`${data.orders} orders`}
                                />
                                <div className="text-xs text-gray-600">{data.date}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Total: {mockRevenueByDay.reduce((sum: number, d: typeof mockRevenueByDay[0]) => sum + d.orders, 0)} orders
                    </div>
                </div>
            </div>

            {/* Top Products & Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Top Products</h2>
                    <div className="space-y-4">
                        {mockTopProducts.map((product: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                                        <div>
                                            <div className="text-sm font-medium text-black line-clamp-1">{product.name}</div>
                                            <div className="text-xs text-gray-600">{product.orders} orders</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-black">₹{product.revenue.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Top Customers</h2>
                    <div className="space-y-4">
                        {mockTopCustomers.map((customer: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                                        <div>
                                            <div className="text-sm font-medium text-black">{customer.name}</div>
                                            <div className="text-xs text-gray-600">{customer.orders} orders</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-black">₹{customer.spent.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
