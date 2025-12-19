import Link from 'next/link';

/**
 * Admin Dashboard
 * Overview page with stats and recent activity
 * Mock data for demonstration
 */

// Mock data
const mockStats = {
    totalOrders: 156,
    pendingOrders: 12,
    totalRevenue: 245680,
    totalProducts: 24,
};

const mockRecentOrders = [
    { id: 'ORD001', customer: 'john@example.com', amount: 1299, status: 'PENDING', date: '2025-12-19' },
    { id: 'ORD002', customer: 'sarah@example.com', amount: 2499, status: 'PAID', date: '2025-12-19' },
    { id: 'ORD003', customer: 'mike@example.com', amount: 1599, status: 'FULFILLED', date: '2025-12-18' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-black">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Overview of your store</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                    <div className="text-2xl md:text-3xl font-semibold text-black">{mockStats.totalOrders}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                    <div className="text-sm text-gray-600 mb-1">Pending Orders</div>
                    <div className="text-2xl md:text-3xl font-semibold text-black">{mockStats.pendingOrders}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-2xl md:text-3xl font-semibold text-black">₹{mockStats.totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Products</div>
                    <div className="text-2xl md:text-3xl font-semibold text-black">{mockStats.totalProducts}</div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-black">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-sm text-black hover:underline">
                        View all →
                    </Link>
                </div>
                <div className="space-y-3">
                    {mockRecentOrders.map((order) => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 border-b border-gray-200 last:border-0">
                            <div className="flex-1">
                                <div className="font-mono text-sm text-black">#{order.id}</div>
                                <div className="text-sm text-gray-600">{order.customer}</div>
                            </div>
                            <div className="flex justify-between sm:justify-end sm:text-right gap-4">
                                <div>
                                    <div className="text-sm font-medium text-black">₹{order.amount}</div>
                                    <div className="text-xs text-gray-600">{order.status}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
