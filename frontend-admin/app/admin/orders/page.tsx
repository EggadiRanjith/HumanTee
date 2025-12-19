import Link from 'next/link';

/**
 * Orders List Page
 * Clean, professional, mobile-responsive
 * Mobile: Card view
 * Desktop: Table view
 */

// Mock data - replace with actual API call
async function getOrders() {
    // TODO: Implement actual API call
    return {
        orders: [],
        total: 0,
        page: 1,
        limit: 20,
    };
}

export default async function OrdersPage() {
    const { orders } = await getOrders();

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-black">Orders</h1>
                <p className="text-sm text-gray-600 mt-1">Manage customer orders</p>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-black mb-2">No orders yet</h3>
                    <p className="text-sm text-gray-600">
                        Orders will appear here once customers start placing them
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile: Card View */}
                    <div className="lg:hidden space-y-4">
                        {orders.map((order: any) => (
                            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-mono text-sm text-gray-900">
                                            #{order.id.substring(0, 8).toUpperCase()}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{order.userEmail}</div>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <div className="text-sm font-medium text-black">
                                        {order.currency} {order.totalAmount}
                                    </div>
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-sm text-black hover:underline"
                                    >
                                        View →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table View */}
                    <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Order ID
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Customer
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Total
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Date
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-900">
                                            #{order.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.userEmail}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.currency} {order.totalAmount}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-sm text-black hover:underline font-medium"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
