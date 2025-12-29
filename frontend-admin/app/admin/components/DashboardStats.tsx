/**
 * Dashboard Stats Component
 * Displays key metrics in a grid layout
 */

import Link from 'next/link';
import { DashboardStats as Stats } from '../hooks/useDashboardData';

interface Props {
    stats: Stats;
}

export function DashboardStats({ stats }: Props) {
    return (
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
    );
}
