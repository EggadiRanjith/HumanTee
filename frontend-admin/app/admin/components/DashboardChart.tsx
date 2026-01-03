/**
 * Dashboard Chart Component
 * Interactive chart showing orders or revenue over time
 */

'use client';

import { useMemo, useState } from 'react';
import { RecentOrder } from '../hooks/useDashboardData';

interface Props {
    orders: RecentOrder[];
}

type ChartType = 'orders' | 'revenue';
type TimeDuration = '7days' | '30days' | '6months';

export function DashboardChart({ orders }: Props) {
    const [chartType, setChartType] = useState<ChartType>('orders');
    const [timeDuration, setTimeDuration] = useState<TimeDuration>('7days');

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
            const dayOrders = orders.filter(order =>
                order.createdAt.split('T')[0] === date
            );
            const orderCount = dayOrders.length;
            const revenue = dayOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

            return { date, orderCount, revenue };
        });

        return result;
    }, [orders, timeDuration]);

    const maxChartValue = useMemo(() => {
        if (chartType === 'orders') {
            return Math.max(...chartData.map(d => d.orderCount), 1);
        } else {
            return Math.max(...chartData.map(d => d.revenue), 1);
        }
    }, [chartData, chartType]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4 mb-6">
                {/* Title and Total */}
                <div>
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-1">
                        {chartType === 'orders' ? 'Orders Analytics' : 'Revenue Analytics'}
                    </h2>
                    <div className="flex items-baseline gap-2 sm:gap-3">
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
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

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {/* Chart Type Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                        <button
                            onClick={() => setChartType('orders')}
                            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${chartType === 'orders'
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                }`}
                        >
                            📦 Orders
                        </button>
                        <button
                            onClick={() => setChartType('revenue')}
                            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${chartType === 'revenue'
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
                        onChange={(e) => setTimeDuration(e.target.value as TimeDuration)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white hover:border-gray-300 transition-colors cursor-pointer shadow-sm"
                    >
                        <option value="7days">📅 7 Days</option>
                        <option value="30days">📅 30 Days</option>
                        <option value="6months">📅 6 Months</option>
                    </select>
                </div>
            </div>

            {/* Chart Container - Fully Responsive */}
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px]">
                {/* Y-axis labels */}
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

                    {/* Grid Lines */}
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

                {/* X-axis Date Labels */}
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
    );
}
