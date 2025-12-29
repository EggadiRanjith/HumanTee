/**
 * Recent Orders List Component
 * Displays the 5 most recent orders
 */

import Link from 'next/link';
import { RecentOrder } from '../hooks/useDashboardData';

interface Props {
    orders: RecentOrder[];
}

function getStatusColor(status: string) {
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
}

function formatStatus(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function RecentOrdersList({ orders }: Props) {
    return (
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-black">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs sm:text-sm text-black hover:underline">
                    View all →
                </Link>
            </div>
            <div className="space-y-3">
                {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No orders yet</p>
                    </div>
                ) : (
                    orders.map((order) => (
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
    );
}
