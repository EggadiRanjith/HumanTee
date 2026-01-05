/**
 * Advanced Analytics Dashboard
 * Deep business insights with real backend data
 * Features: Trends, comparisons, customer analytics, product performance
 */

'use client';

import { useState, useMemo } from 'react';
import { useAnalytics } from '@/lib/queries/useAnalytics';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiShoppingCart, FiDollarSign, FiPackage, FiAlertCircle } from 'react-icons/fi';

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('30d');

    // Use React Query hook - automatic caching and loading states
    const { data, isLoading, error } = useAnalytics(dateRange);

    // Extract data with fallbacks
    const metrics = data?.metrics || {
        totalRevenue: 0,
        revenueChange: 0,
        totalOrders: 0,
        ordersChange: 0,
        avgOrderValue: 0,
        avgOrderValueChange: 0,
        conversionRate: 0,
        conversionRateChange: 0
    };

    const revenueByDay = data?.revenueByDay || [];
    const customerMetrics = data?.customerMetrics || {
        newCustomers: 0,
        returningCustomers: 0,
        retentionRate: 0,
        avgLifetimeValue: 0,
        topCustomers: []
    };
    const productMetrics = data?.productMetrics || {
        topProducts: [],
        lowStockProducts: [],
        revenueByCategory: []
    };
    const conversionMetrics = data?.conversionMetrics || {
        cartCreated: 0,
        checkoutStarted: 0,
        ordersCompleted: 0,
        abandonmentRate: 0
    };

    const maxRevenue = useMemo(() => Math.max(...revenueByDay.map((d: any) => d.revenue), 1), [revenueByDay]);

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

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Failed to load analytics</p>
                    <p className="text-sm text-gray-500">Please check your backend connection</p>
                </div>
            </div>
        );
    }

    const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) => {
        const isPositive = change >= 0;
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">{title}</span>
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-black mb-1">
                    {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                    {Math.abs(change)}% vs previous period
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Advanced Analytics</h1>
                    <p className="text-sm text-gray-600 mt-1">Deep insights and business intelligence</p>
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                </select>
            </div>

            {/* Key Metrics with Comparison */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Revenue"
                    value={metrics.totalRevenue}
                    change={metrics.revenueChange}
                    icon={FiDollarSign}
                    prefix="₹"
                />
                <MetricCard
                    title="Total Orders"
                    value={metrics.totalOrders}
                    change={metrics.ordersChange}
                    icon={FiShoppingCart}
                />
                <MetricCard
                    title="Avg Order Value"
                    value={metrics.avgOrderValue}
                    change={metrics.avgOrderValueChange}
                    icon={FiTrendingUp}
                    prefix="₹"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={metrics.conversionRate}
                    change={metrics.conversionRateChange}
                    icon={FiUsers}
                    suffix="%"
                />
            </div>

            {/* Revenue Trend (Line Chart) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-black mb-4">Revenue & Orders Trend</h2>
                <div className="h-64 flex items-end justify-between gap-1">
                    {revenueByDay.map((data: any, index: number) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col items-center gap-1">
                                {/* Revenue Bar */}
                                <div
                                    className="w-full bg-black rounded-t hover:bg-gray-800 transition-colors cursor-pointer"
                                    style={{ height: `${(data.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                                    title={`₹${data.revenue.toLocaleString()}`}
                                />
                                {/* Orders Indicator */}
                                <div className="text-[9px] text-blue-600 font-bold">{data.orders}</div>
                            </div>
                            <div className="text-[10px] text-gray-600 rotate-45 origin-left">{data.date}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-black rounded"></div>
                        <span className="text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                        <span className="text-gray-600">Orders</span>
                    </div>
                </div>
            </div>

            {/* Customer Analytics & Product Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Segmentation */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Customer Insights</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="text-2xl font-bold text-blue-600">{customerMetrics.newCustomers}</div>
                                <div className="text-xs text-blue-700 mt-1">New Customers</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="text-2xl font-bold text-green-600">{customerMetrics.returningCustomers}</div>
                                <div className="text-xs text-green-700 mt-1">Returning</div>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Retention Rate</span>
                                <span className="text-sm font-bold text-black">{customerMetrics.retentionRate}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Avg Lifetime Value</span>
                                <span className="text-sm font-bold text-black">₹{customerMetrics.avgLifetimeValue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Conversion Funnel</h2>
                    <div className="space-y-3">
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Carts Created</span>
                                <span className="text-sm font-bold text-black">{conversionMetrics.cartCreated}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Checkout Started</span>
                                <span className="text-sm font-bold text-black">{conversionMetrics.checkoutStarted}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${(conversionMetrics.checkoutStarted / conversionMetrics.cartCreated) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Orders Completed</span>
                                <span className="text-sm font-bold text-black">{conversionMetrics.ordersCompleted}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${(conversionMetrics.ordersCompleted / conversionMetrics.cartCreated) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Cart Abandonment Rate</span>
                                <span className="text-sm font-bold text-red-600">{conversionMetrics.abandonmentRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products & Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Top Products</h2>
                    <div className="space-y-3">
                        {productMetrics.topProducts.slice(0, 5).map((product: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-black truncate">{product.name}</div>
                                        <div className="text-xs text-gray-600">{product.orders} orders • Stock: {product.stock}</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-black">₹{product.revenue.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Top Customers</h2>
                    <div className="space-y-3">
                        {customerMetrics.topCustomers.slice(0, 5).map((customer: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-black truncate">{customer.name}</div>
                                        <div className="text-xs text-gray-600 truncate">{customer.email} • {customer.orderCount} orders</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-black">₹{customer.totalSpent.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {productMetrics.lowStockProducts.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiAlertCircle className="w-5 h-5 text-orange-600" />
                        <h2 className="text-lg font-semibold text-orange-900">Low Stock Alert</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {productMetrics.lowStockProducts.map((product: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-orange-200">
                                <div className="text-sm font-medium text-black truncate">{product.name}</div>
                                <div className="text-xs text-orange-600 mt-1">Only {product.stock} left • {product.sold} sold</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
