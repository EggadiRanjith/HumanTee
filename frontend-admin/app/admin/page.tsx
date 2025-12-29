/**
 * Admin Dashboard (PRODUCTION-GRADE)
 * Features: Real API data, stats, charts, recent activity, quick actions
 * Mobile-responsive with all key metrics
 */

'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/api-client';

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    paidAmount: number;
    pendingPayments: number;
}

interface RecentOrder {
    id: string;
    orderNumber: string;
    address: {
        fullName: string;
        email: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
    payments?: Array<{
        status: string;
    }>;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        paidAmount: 0,
        pendingPayments: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [allOrders, setAllOrders] = useState<RecentOrder[]>([]); // All orders for chart
    const [isLoading, setIsLoading] = useState(true);
    const [chartType, setChartType] = useState<'orders' | 'revenue'>('orders'); // Toggle: orders or revenue
    const [timeDuration, setTimeDuration] = useState<'7days' | '30days' | '6months'>('7days'); // Time range

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);

            // Fetch all orders to calculate stats
            const response = await apiClient.get('/admin/orders', {
                params: { limit: 100 }
            });

            const orders = response.data.orders || [];
            setAllOrders(orders); // Store all orders for chart

            // Calculate statistics
            const totalOrders = orders.length;
            const pendingOrders = orders.filter((o: RecentOrder) =>
                o.status.toLowerCase() === 'pending_payment' || o.status.toLowerCase() === 'pending'
            ).length;
            const processingOrders = orders.filter((o: RecentOrder) => o.status.toLowerCase() === 'processing').length;
            const shippedOrders = orders.filter((o: RecentOrder) => o.status.toLowerCase() === 'shipped').length;
            const deliveredOrders = orders.filter((o: RecentOrder) => o.status.toLowerCase() === 'delivered').length;

            const totalRevenue = orders.reduce((sum: number, o: RecentOrder) => sum + Number(o.totalAmount), 0);
            const paidAmount = orders
                .filter((o: RecentOrder) => o.payments?.[0]?.status?.toLowerCase() === 'paid')
                .reduce((sum: number, o: RecentOrder) => sum + Number(o.totalAmount), 0);
            const pendingPayments = totalRevenue - paidAmount;

            setStats({
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                totalRevenue,
                paidAmount,
                pendingPayments,
            });

            // Get 5 most recent orders
            setRecentOrders(orders.slice(0, 5));

        } catch (error) {
            // Error handling - could add toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    // Calculate chart data based on selected duration
    const chartData = useMemo(() => {
        const days = timeDuration === '7days' ? 7 : timeDuration === '30days' ? 30 : 180;
        const halfDays = Math.floor(days / 2);

        // Create date range centered around today
        const dateRange = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - halfDays + i);
            return date.toISOString().split('T')[0];
        });

        const result = dateRange.map(date => {
            const dayOrders = allOrders.filter(order =>
                order.createdAt.split('T')[0] === date
            );
            const orderCount = dayOrders.length;
            const revenue = dayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

            return { date, orderCount, revenue };
        });

        return result;
    }, [allOrders, timeDuration]);

    const maxChartValue = useMemo(() => {
        if (chartType === 'orders') {
            return Math.max(...chartData.map(d => d.orderCount), 1);
        } else {
            return Math.max(...chartData.map(d => d.revenue), 1);
        }
    }, [chartData, chartType]);

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

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">Dashboard</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Overview of your store</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">{stats.totalOrders}</div>
                    <div className="text-xs text-gray-500 mt-1">All time</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Pending Orders</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-yellow-600">{stats.pendingOrders}</div>
                    <Link href="/admin/orders?status=pending" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        View all →
                    </Link>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">₹{stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-green-600 mt-1">₹{stats.paidAmount.toLocaleString()} paid</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Processing</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600">{stats.processingOrders}</div>
                    <div className="text-xs text-gray-500 mt-1">{stats.shippedOrders} shipped</div>
                </div>
            </div>

            {/* Interactive Chart - Professional Design */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-black mb-1">
                            {chartType === 'orders' ? 'Orders Analytics' : 'Revenue Analytics'}
                        </h2>
                        <div className="flex items-baseline gap-3">
                            <p className="text-2xl sm:text-3xl font-bold text-black">
                                {chartType === 'orders'
                                    ? chartData.reduce((sum, d) => sum + d.orderCount, 0)
                                    : `₹${chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}`
                                }
                            </p>
                            <p className="text-xs text-gray-500">
                                {timeDuration === '7days' ? 'Last 7 Days' : timeDuration === '30days' ? 'Last 30 Days' : 'Last 6 Months'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Chart Type Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                            <button
                                onClick={() => setChartType('orders')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${chartType === 'orders'
                                    ? 'bg-black text-white shadow-sm'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                📦 Orders
                            </button>
                            <button
                                onClick={() => setChartType('revenue')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${chartType === 'revenue'
                                    ? 'bg-black text-white shadow-sm'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                💰 Revenue
                            </button>
                        </div>

                        {/* Time Duration Selector */}
                        <select
                            value={timeDuration}
                            onChange={(e) => setTimeDuration(e.target.value as any)}
                            className="px-4 py-2 text-xs font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white hover:border-gray-300 transition-colors cursor-pointer shadow-sm"
                        >
                            <option value="7days">📅 7 Days</option>
                            <option value="30days">📅 30 Days</option>
                            <option value="6months">📅 6 Months</option>
                        </select>
                    </div>
                </div>

                {/* Chart Container - Fully Responsive */}
                <div className="relative w-full" style={{ height: '300px' }}>
                    {/* Y-axis labels - Absolute positioned */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-5 pr-2">
                        {[0, 1, 2, 3, 4].map((i) => {
                            const value = Math.round((maxChartValue * (4 - i)) / 4);
                            const displayValue = chartType === 'orders'
                                ? value
                                : `₹${(value / 1000).toFixed(0)}k`;
                            return (
                                <div key={i} className="text-xs text-gray-400 text-right font-medium">
                                    {displayValue}
                                </div>
                            );
                        })}
                    </div>

                    <svg
                        className="w-full h-full pl-12"
                        viewBox="0 0 1000 300"
                        preserveAspectRatio="none"
                    >
                        {/* Gradient Definitions */}
                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                            </linearGradient>
                            <filter id="shadow">
                                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
                            </filter>
                        </defs>

                        {/* Grid Lines - Subtle */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line
                                key={i}
                                x1="0"
                                y1={20 + i * 60}
                                x2="1000"
                                y2={20 + i * 60}
                                stroke="#f3f4f6"
                                strokeWidth="1"
                                strokeDasharray="4,4"
                            />
                        ))}

                        {/* Y-axis labels - Positioned outside SVG */}

                        {/* Chart Line and Area */}
                        {(() => {
                            const chartTop = 20;
                            const chartBottom = 260;
                            const chartHeight = chartBottom - chartTop;

                            const points = chartData.map((data, index) => {
                                const value = chartType === 'orders' ? data.orderCount : data.revenue;
                                const x = (index / Math.max(chartData.length - 1, 1)) * 1000;
                                const y = value > 0 ? chartBottom - ((value / maxChartValue) * chartHeight) : chartBottom;
                                return { x, y, value, data };
                            });

                            // Create smooth Bezier curve path
                            let pathData = '';
                            points.forEach((point, index) => {
                                if (index === 0) {
                                    pathData += `M ${point.x} ${point.y}`;
                                } else {
                                    const prevPoint = points[index - 1];
                                    const cpX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
                                    const cpX2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;
                                    pathData += ` C ${cpX1} ${prevPoint.y}, ${cpX2} ${point.y}, ${point.x} ${point.y}`;
                                }
                            });

                            const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartBottom} L 0 ${chartBottom} Z`;

                            return (
                                <g className="transition-all duration-300 ease-in-out">
                                    {/* Area fill with gradient */}
                                    <path
                                        d={areaPath}
                                        fill="url(#chartGradient)"
                                        className="transition-all duration-300"
                                    />

                                    {/* Main line */}
                                    <path
                                        d={pathData}
                                        fill="none"
                                        stroke="#000000"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#shadow)"
                                        className="transition-all duration-500"
                                    />

                                    {/* Data points with hover effect */}
                                    {points.map((point, index) => {
                                        if (point.value === 0) return null;
                                        const displayValue = chartType === 'orders'
                                            ? `${point.value} orders`
                                            : `₹${point.value.toLocaleString()}`;
                                        const date = new Date(point.data.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        });

                                        return (
                                            <g key={index} className="cursor-pointer group">
                                                {/* Outer glow on hover */}
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="8"
                                                    fill="#000000"
                                                    fillOpacity="0"
                                                    className="group-hover:fill-opacity-10 transition-all duration-200"
                                                />
                                                {/* Main point */}
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="5"
                                                    fill="#000000"
                                                    stroke="#ffffff"
                                                    strokeWidth="3"
                                                    className="group-hover:r-6 transition-all duration-200"
                                                    filter="url(#shadow)"
                                                >
                                                    <title>{`${date}\n${displayValue}`}</title>
                                                </circle>
                                            </g>
                                        );
                                    })}
                                </g>
                            );
                        })()}
                    </svg>

                    {/* X-axis Date Labels - Below Chart */}
                    <div className="absolute bottom-0 left-12 right-0 flex justify-between pb-2">
                        {chartData.map((data, index) => {
                            const showLabel = timeDuration === '7days'
                                ? true
                                : timeDuration === '30days'
                                    ? index % 5 === 0 || index === chartData.length - 1
                                    : index % 30 === 0 || index === chartData.length - 1;

                            return showLabel ? (
                                <div key={index} className="text-xs font-medium text-gray-400 flex-1 text-center">
                                    {new Date(data.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            ) : (
                                <div key={index} className="flex-1" />
                            );
                        })}
                    </div>
                </div>

                {/* Chart Legend/Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Peak</p>
                        <p className="text-sm font-semibold text-black">
                            {chartType === 'orders'
                                ? Math.max(...chartData.map(d => d.orderCount))
                                : `₹${Math.max(...chartData.map(d => d.revenue)).toLocaleString()}`
                            }
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Average</p>
                        <p className="text-sm font-semibold text-black">
                            {chartType === 'orders'
                                ? Math.round(chartData.reduce((sum, d) => sum + d.orderCount, 0) / chartData.length)
                                : `₹${Math.round(chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length).toLocaleString()}`
                            }
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Days Active</p>
                        <p className="text-sm font-semibold text-black">
                            {chartData.filter(d => (chartType === 'orders' ? d.orderCount : d.revenue) > 0).length}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="text-sm font-semibold text-black">
                            {chartType === 'orders'
                                ? chartData.reduce((sum, d) => sum + d.orderCount, 0)
                                : `₹${chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Order Status</h2>
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
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-4">Payment Overview</h2>
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
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No orders yet</p>
                            </div>
                        ) : (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="font-mono text-sm text-black">{order.orderNumber}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">{order.address.email}</div>
                                    </div>
                                    <div className="flex justify-between sm:justify-end sm:text-right gap-4 items-center">
                                        <div>
                                            <div className="text-sm font-medium text-black">₹{Number(order.totalAmount).toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
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
                            href="/admin/orders?status=pending"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors text-sm text-center"
                        >
                            Pending Orders ({stats.pendingOrders})
                        </Link>
                    </div>

                    {/* Alerts */}
                    {stats.pendingPayments > 0 && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-yellow-900 mb-1">⚠️ Pending Payments</div>
                            <div className="text-xs text-yellow-700">₹{stats.pendingPayments.toLocaleString()} awaiting payment</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
