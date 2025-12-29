/**
 * Quick Actions Component
 * Provides quick access to common admin tasks
 */

import Link from 'next/link';
import { DashboardStats } from '../hooks/useDashboardData';

interface Props {
    stats: DashboardStats;
}

export function QuickActions({ stats }: Props) {
    return (
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
    );
}
