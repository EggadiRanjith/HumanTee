/**
 * Advanced Analytics Dashboard with Recharts
 * Professional visualizations with real backend data
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAnalytics } from '@/lib/queries/useAnalytics';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiShoppingCart, FiDollarSign, FiPackage, FiAlertCircle, FiBarChart2 } from 'react-icons/fi';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Area,
    AreaChart,
} from 'recharts';

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('30d');
    const [isMobile, setIsMobile] = useState(false);

    const { data, isLoading, error } = useAnalytics(dateRange);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const metrics = data?.metrics || { totalRevenue: 0, revenueChange: 0, totalOrders: 0, ordersChange: 0, avgOrderValue: 0, avgOrderValueChange: 0, conversionRate: 0, conversionRateChange: 0 };
    const revenueByDay = data?.revenueByDay || [];
    const customerMetrics = data?.customerMetrics || { newCustomers: 0, returningCustomers: 0, retentionRate: 0, avgLifetimeValue: 0, topCustomers: [] };
    const customerGrowth = data?.customerGrowth || [];
    const discountMetrics = data?.discountMetrics || { totalDiscountsUsed: 0, totalDiscountRevenue: 0, avgDiscountValue: 0, discountUsageChange: 0, topDiscounts: [], discountsByDay: [] };
    const productMetrics = data?.productMetrics || { topProducts: [], lowStockProducts: [], revenueByCategory: [] };
    const conversionMetrics = data?.conversionMetrics || { cartCreated: 0, checkoutStarted: 0, ordersCompleted: 0, abandonmentRate: 0 };
    const salesPatterns = data?.salesPatterns || { peakHours: [], peakDays: [], avgOrderItems: 0 };
    const returnMetrics = data?.returnMetrics || { returnRate: 0, refundRate: 0, totalReturns: 0, totalRefunds: 0, returnReasons: [] };
    const totalCategoryRevenue = useMemo(() => productMetrics.revenueByCategory.reduce((sum: number, cat: any) => sum + cat.revenue, 0), [productMetrics.revenueByCategory]);

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-600">Loading analytics...</p></div></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" /><p className="text-red-600 mb-4">Failed to load analytics</p></div></div>;

    const MetricCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '' }: any) => {
        const isPositive = change >= 0;
        return <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"><div className="flex items-center justify-between mb-2"><span className="text-xs sm:text-xs text-gray-600 uppercase tracking-wider font-medium truncate pr-2">{title}</span><Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" /></div><div className="text-xl sm:text-2xl font-bold text-black mb-1">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</div><div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{isPositive ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}<span className="truncate">{Math.abs(change)}% vs previous</span></div></div>;
    };

    const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
        <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-black rounded-lg"><Icon className="w-5 h-5 text-white" /></div><div><h2 className="text-xl font-bold text-gray-900">{title}</h2><p className="text-sm text-gray-600">{subtitle}</p></div></div>
    );

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg max-w-[200px]"><p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 truncate">{label}</p>{payload.map((entry: any, index: number) => <p key={index} className="text-xs truncate" style={{ color: entry.color }}>{entry.name}: {entry.name.includes('Revenue') || entry.name.includes('revenue') ? '₹' : ''}{entry.value.toLocaleString()}</p>)}</div>;
        }
        return null;
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div><h1 className="text-xl sm:text-2xl font-semibold text-black">Advanced Analytics</h1><p className="text-xs sm:text-sm text-gray-600 mt-1">Comprehensive business intelligence dashboard</p></div>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none w-full sm:w-auto"><option value="7d">Last 7 Days</option><option value="30d">Last 30 Days</option><option value="90d">Last 90 Days</option><option value="1y">Last Year</option></select>
            </div>

            <section>
                <SectionHeader icon={FiBarChart2} title="Key Metrics Overview" subtitle="High-level performance indicators" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <MetricCard title="Total Revenue" value={metrics.totalRevenue} change={metrics.revenueChange} icon={FiDollarSign} prefix="₹" />
                    <MetricCard title="Total Orders" value={metrics.totalOrders} change={metrics.ordersChange} icon={FiShoppingCart} />
                    <MetricCard title="Avg Order Value" value={metrics.avgOrderValue} change={metrics.avgOrderValueChange} icon={FiTrendingUp} prefix="₹" />
                    <MetricCard title="Conversion Rate" value={metrics.conversionRate} change={metrics.conversionRateChange} icon={FiUsers} suffix="%" />
                </div>
            </section>

            <section>
                <SectionHeader icon={FiDollarSign} title="Revenue Analysis" subtitle="Revenue trends, categories, and patterns" />
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Revenue & Orders Trend</h3>
                    {revenueByDay.length > 0 ? (
                        isMobile ? (
                            // Mobile: Simplified separate charts
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-600 mb-2">Revenue</p>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <BarChart data={revenueByDay}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#666" />
                                            <YAxis tick={{ fontSize: 9 }} stroke="#666" tickFormatter={(value) => `₹${value}`} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="revenue" fill="#000000" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-2">Orders</p>
                                    <ResponsiveContainer width="100%" height={120}>
                                        <BarChart data={revenueByDay}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#666" />
                                            <YAxis tick={{ fontSize: 9 }} stroke="#666" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} name="Orders" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            // Desktop: Original ComposedChart
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={revenueByDay}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#666" tickFormatter={(value) => `₹${value}`} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#666" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#000000" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2} name="Orders" dot={{ fill: '#2563eb', r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )
                    ) : <div className="h-48 sm:h-64 flex items-center justify-center"><div className="text-center text-gray-500"><FiAlertCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" /><p className="text-xs sm:text-sm">No revenue data available</p></div></div>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Revenue by Category</h3>
                        {productMetrics.revenueByCategory.length > 0 ? (
                            <div className="space-y-3">
                                {productMetrics.revenueByCategory.map((category: any, index: number) => {
                                    const percentage = totalCategoryRevenue > 0 ? (category.revenue / totalCategoryRevenue) * 100 : 0;
                                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                                    const textColors = ['text-blue-700', 'text-green-700', 'text-purple-700', 'text-orange-700', 'text-pink-700'];
                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                                <span className="font-medium text-gray-900 truncate pr-2">{category.name}</span>
                                                <span className="font-bold text-black flex-shrink-0">₹{category.revenue.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${colors[index % colors.length]} transition-all duration-500`} style={{ width: `${percentage}%` }} /></div>
                                                <span className={`text-xs font-bold ${textColors[index % textColors.length]} flex-shrink-0`}>{percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="text-xs text-gray-600">{category.orders} orders • {category.items} items sold</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <div className="text-center py-6 sm:py-8 text-gray-500"><p className="text-xs sm:text-sm">No category data</p></div>}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Discount Performance</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100"><div className="text-xl sm:text-2xl font-bold text-purple-600">{discountMetrics.totalDiscountsUsed}</div><div className="text-xs text-purple-700 mt-1">Total Used</div></div>
                                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100"><div className="text-xl sm:text-2xl font-bold text-orange-600">₹{discountMetrics.totalDiscountRevenue.toLocaleString()}</div><div className="text-xs text-orange-700 mt-1">Revenue Impact</div></div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2"><span className="text-xs sm:text-sm text-gray-600">Avg Discount Value</span><span className="text-xs sm:text-sm font-bold text-black">₹{discountMetrics.avgDiscountValue.toLocaleString()}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-600">Usage Change</span><span className={`text-xs sm:text-sm font-bold ${discountMetrics.discountUsageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>{discountMetrics.discountUsageChange >= 0 ? '+' : ''}{discountMetrics.discountUsageChange}%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader icon={FiUsers} title="Customer Analytics" subtitle="Customer acquisition, retention, and behavior" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Customer Insights</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100"><div className="text-xl sm:text-2xl font-bold text-blue-600">{customerMetrics.newCustomers}</div><div className="text-xs text-blue-700 mt-1">New Customers</div></div>
                                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100"><div className="text-xl sm:text-2xl font-bold text-green-600">{customerMetrics.returningCustomers}</div><div className="text-xs text-green-700 mt-1">Returning</div></div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2"><span className="text-xs sm:text-sm text-gray-600">Retention Rate</span><span className="text-xs sm:text-sm font-bold text-black">{customerMetrics.retentionRate}%</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-600">Avg Lifetime Value</span><span className="text-xs sm:text-sm font-bold text-black">₹{customerMetrics.avgLifetimeValue.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Conversion Funnel</h3>
                        <div className="space-y-3">
                            <div><div className="flex justify-between items-center mb-1"><span className="text-xs sm:text-sm text-gray-600">Unique Customers (Cart Created)</span><span className="text-xs sm:text-sm font-bold text-black">{conversionMetrics.cartCreated}</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: '100%' }}></div></div></div>
                            <div><div className="flex justify-between items-center mb-1"><span className="text-xs sm:text-sm text-gray-600">Unique Customers (Checkout Started)</span><span className="text-xs sm:text-sm font-bold text-black">{conversionMetrics.checkoutStarted}</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${(conversionMetrics.checkoutStarted / conversionMetrics.cartCreated) * 100}%` }}></div></div></div>
                            <div><div className="flex justify-between items-center mb-1"><span className="text-xs sm:text-sm text-gray-600">Unique Customers (Order Completed)</span><span className="text-xs sm:text-sm font-bold text-black">{conversionMetrics.ordersCompleted}</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${(conversionMetrics.ordersCompleted / conversionMetrics.cartCreated) * 100}%` }}></div></div></div>
                            <div className="pt-3 border-t border-gray-100"><div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-600">Customer Abandonment Rate</span><span className="text-xs sm:text-sm font-bold text-red-600">{conversionMetrics.abandonmentRate}%</span></div></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Customer Growth Trend</h3>
                    {customerGrowth.length > 0 ? (
                        isMobile ? (
                            // Mobile: Compact list view with progress bars
                            <div className="space-y-3">
                                {customerGrowth.map((day: any, index: number) => {
                                    const total = day.newCustomers + day.returningCustomers;
                                    const newPercent = total > 0 ? (day.newCustomers / total) * 100 : 0;
                                    const returningPercent = total > 0 ? (day.returningCustomers / total) * 100 : 0;
                                    return (
                                        <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-gray-900">{day.date}</span>
                                                <span className="text-xs font-bold text-black">{total} total</span>
                                            </div>
                                            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
                                                <div className="bg-blue-500" style={{ width: `${newPercent}%` }} title={`${day.newCustomers} new`}></div>
                                                <div className="bg-green-500" style={{ width: `${returningPercent}%` }} title={`${day.returningCustomers} returning`}></div>
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs text-gray-600">
                                                <span className="text-blue-600">{day.newCustomers} new</span>
                                                <span className="text-green-600">{day.returningCustomers} returning</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // Desktop: Original AreaChart
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={customerGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                                    <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="New Customers" />
                                    <Area type="monotone" dataKey="returningCustomers" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Returning Customers" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )
                    ) : <div className="h-48 sm:h-64 flex items-center justify-center"><p className="text-xs sm:text-sm text-gray-500">No customer growth data</p></div>}
                </div>
            </section>

            <section>
                <SectionHeader icon={FiPackage} title="Product Performance" subtitle="Top products and inventory" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Top Products</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {productMetrics.topProducts.slice(0, 5).map((product: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"><div className="text-sm sm:text-lg font-bold text-gray-400">#{index + 1}</div><div className="flex-1 min-w-0"><div className="text-xs sm:text-sm font-medium text-black truncate">{product.name}</div><div className="text-xs text-gray-600">{product.orders} orders • Stock: {product.stock}</div></div></div>
                                    <div className="text-xs sm:text-sm font-bold text-black flex-shrink-0">₹{product.revenue.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Top Customers</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {customerMetrics.topCustomers.slice(0, 5).map((customer: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"><div className="text-sm sm:text-lg font-bold text-gray-400">#{index + 1}</div><div className="flex-1 min-w-0"><div className="text-xs sm:text-sm font-medium text-black truncate">{customer.name}</div><div className="text-xs text-gray-600 truncate">{customer.email} • {customer.orderCount} orders</div></div></div>
                                    <div className="text-xs sm:text-sm font-bold text-black flex-shrink-0">₹{customer.totalSpent.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader icon={FiAlertCircle} title="Operational Metrics" subtitle="Sales patterns and inventory" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Peak Sales Hours</h3>
                        {salesPatterns.peakHours.length > 0 ? (
                            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                                <BarChart data={salesPatterns.peakHours} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 12 }} />
                                    <YAxis dataKey="hour" type="category" tick={{ fontSize: isMobile ? 9 : 11 }} width={isMobile ? 60 : 80} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="orders" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="h-48 sm:h-64 flex items-center justify-center"><p className="text-xs sm:text-sm text-gray-500">No data</p></div>}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Best Performing Days</h3>
                        {salesPatterns.peakDays.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
                                    <BarChart data={salesPatterns.peakDays}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" tick={{ fontSize: isMobile ? 9 : 11 }} angle={isMobile ? -45 : 0} textAnchor={isMobile ? "end" : "middle"} height={isMobile ? 60 : 30} />
                                        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-4 pt-4 border-t border-gray-100"><div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-600">Avg Items per Order</span><span className="text-xs sm:text-sm font-bold text-black">{salesPatterns.avgOrderItems.toFixed(1)}</span></div></div>
                            </>
                        ) : <div className="h-48 sm:h-64 flex items-center justify-center"><p className="text-xs sm:text-sm text-gray-500">No data</p></div>}
                    </div>
                </div>

                {productMetrics.lowStockProducts.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4"><FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" /><h3 className="text-base sm:text-lg font-semibold text-orange-900">Low Stock Alert</h3></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {productMetrics.lowStockProducts.map((product: any, index: number) => (
                                <div key={index} className="bg-white rounded-lg p-3 border border-orange-200"><div className="text-xs sm:text-sm font-medium text-black truncate">{product.name}</div><div className="text-xs text-orange-600 mt-1">Only {product.stock} left • {product.sold} sold</div></div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
