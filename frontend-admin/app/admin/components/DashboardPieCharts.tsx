/**
 * Dashboard Charts Component
 * Mobile: Sparklines + summary (trend-focused)
 * Desktop: Full bar charts (precision-focused)
 * Production-grade responsive design
 */

'use client';

import { useMemo, useState } from 'react';
import { RecentOrder } from '../hooks/useDashboardData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Props {
    orders: RecentOrder[];
}

type TimePeriod = '7days' | '30days' | '6months';

// Shared aggregation utility - DRY principle
function aggregateByDate(
    orders: RecentOrder[],
    days: number,
    valueSelector: (o: RecentOrder) => number
) {
    const map = new Map<string, number>();
    const now = new Date();

    // Initialize all days with 0
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        map.set(d.toISOString().split('T')[0], 0);
    }

    // Aggregate values
    for (const order of orders) {
        const key = order.createdAt.split('T')[0];
        if (map.has(key)) {
            map.set(key, map.get(key)! + valueSelector(order));
        }
    }

    return Array.from(map.entries()).map(([date, value]) => ({
        date,
        label: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
        value,
    }));
}

// Calculate percentage change
function calculateChange(data: { value: number }[]): number {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, d) => sum + d.value, 0);
    const previous = data.slice(-14, -7).reduce((sum, d) => sum + d.value, 0);
    if (previous === 0) return recent > 0 ? 100 : 0;
    return Math.round(((recent - previous) / previous) * 100);
}

export function DashboardCharts({ orders }: Props) {
    const [ordersPeriod, setOrdersPeriod] = useState<TimePeriod>('7days');
    const [revenuePeriod, setRevenuePeriod] = useState<TimePeriod>('7days');

    const ordersDays = ordersPeriod === '7days' ? 7 : ordersPeriod === '30days' ? 30 : 180;
    const revenueDays = revenuePeriod === '7days' ? 7 : revenuePeriod === '30days' ? 30 : 180;

    const ordersData = useMemo(
        () => aggregateByDate(orders, ordersDays, () => 1),
        [orders, ordersDays]
    );

    const revenueData = useMemo(
        () => aggregateByDate(orders, revenueDays, (o) => Number(o.totalAmount)),
        [orders, revenueDays]
    );

    const totalOrders = ordersData.reduce((sum, item) => sum + item.value, 0);
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
    const ordersChange = calculateChange(ordersData);
    const revenueChange = calculateChange(revenueData);

    const periodLabel = (period: TimePeriod) =>
        period === '7days' ? '7 days' : period === '30days' ? '30 days' : '6 months';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Orders Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-sm text-gray-600 mb-1">Orders</h2>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl sm:text-3xl font-bold text-black">{totalOrders}</p>
                            {ordersChange !== 0 && (
                                <span className={`text-xs font-semibold ${ordersChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {ordersChange > 0 ? '↑' : '↓'}{Math.abs(ordersChange)}%
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last {periodLabel(ordersPeriod)}</p>
                    </div>
                    <select
                        value={ordersPeriod}
                        onChange={(e) => setOrdersPeriod(e.target.value as TimePeriod)}
                        className="px-2 py-1 text-xs font-medium border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none bg-white"
                    >
                        <option value="7days">7D</option>
                        <option value="30days">30D</option>
                        <option value="6months">6M</option>
                    </select>
                </div>

                {/* Mobile: Sparkline */}
                <div className="block lg:hidden">
                    <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={ordersData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#000"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    padding: '4px 8px'
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Desktop: Full Bar Chart */}
                <div className="hidden lg:block">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11 }}
                                interval={ordersPeriod === '7days' ? 0 : ordersPeriod === '30days' ? 4 : 29}
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Peak</p>
                        <p className="text-sm font-semibold text-black">
                            {Math.max(...ordersData.map(d => d.value))}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Avg</p>
                        <p className="text-sm font-semibold text-black">
                            {Math.round(totalOrders / ordersData.length)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Active</p>
                        <p className="text-sm font-semibold text-black">
                            {ordersData.filter(d => d.value > 0).length}d
                        </p>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-sm text-gray-600 mb-1">Revenue</h2>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl sm:text-3xl font-bold text-black">₹{totalRevenue.toLocaleString()}</p>
                            {revenueChange !== 0 && (
                                <span className={`text-xs font-semibold ${revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {revenueChange > 0 ? '↑' : '↓'}{Math.abs(revenueChange)}%
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last {periodLabel(revenuePeriod)}</p>
                    </div>
                    <select
                        value={revenuePeriod}
                        onChange={(e) => setRevenuePeriod(e.target.value as TimePeriod)}
                        className="px-2 py-1 text-xs font-medium border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-black outline-none bg-white"
                    >
                        <option value="7days">7D</option>
                        <option value="30days">30D</option>
                        <option value="6months">6M</option>
                    </select>
                </div>

                {/* Mobile: Sparkline */}
                <div className="block lg:hidden">
                    <ResponsiveContainer width="100%" height={60}>
                        <LineChart data={revenueData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#000"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Tooltip
                                formatter={(value: number | undefined) => `₹${(value ?? 0).toLocaleString()}`}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    padding: '4px 8px'
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Desktop: Full Bar Chart */}
                <div className="hidden lg:block">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11 }}
                                interval={revenuePeriod === '7days' ? 0 : revenuePeriod === '30days' ? 4 : 29}
                            />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip
                                formatter={(value: number | undefined) => `₹${(value ?? 0).toLocaleString()}`}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Peak</p>
                        <p className="text-sm font-semibold text-black">
                            ₹{Math.max(...revenueData.map(d => d.value)).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Avg</p>
                        <p className="text-sm font-semibold text-black">
                            ₹{Math.round(totalRevenue / revenueData.length).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mb-0.5">Active</p>
                        <p className="text-sm font-semibold text-black">
                            {revenueData.filter(d => d.value > 0).length}d
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
