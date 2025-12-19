'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Order Detail Page
 * Clean, professional, mobile-responsive
 * Mock data for demonstration
 */

// Mock order data
const mockOrder = {
    id: 'ORD12345',
    customer: {
        email: 'customer@example.com',
        name: 'John Doe',
    },
    status: 'PAID',
    total: 2499,
    currency: '₹',
    date: '2025-12-19T10:30:00',
    items: [
        { id: '1', name: 'Premium T-Shirt', variant: 'Black / L', quantity: 2, price: 1299 },
        { id: '2', name: 'Classic Tee', variant: 'White / M', quantity: 1, price: 1200 },
    ],
    payment: {
        method: 'Razorpay',
        status: 'Success',
        transactionId: 'pay_abc123xyz',
    },
};

export default function OrderDetailPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-600 hover:text-black mb-3 inline-block"
                >
                    ← Back to orders
                </button>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold text-black">Order #{mockOrder.id}</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {new Date(mockOrder.date).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button className="bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm">
                            Fulfill Order
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm">
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Customer</h3>
                    <div className="text-black font-medium">{mockOrder.customer.name}</div>
                    <div className="text-sm text-gray-600">{mockOrder.customer.email}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Status</h3>
                    <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                        {mockOrder.status}
                    </span>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Total</h3>
                    <div className="text-2xl font-semibold text-black">
                        {mockOrder.currency}{mockOrder.total}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-black mb-4">Items</h2>
                <div className="space-y-4">
                    {mockOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-0">
                            <div>
                                <div className="font-medium text-black">{item.name}</div>
                                <div className="text-sm text-gray-600">{item.variant}</div>
                                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-black">{mockOrder.currency}{item.price * item.quantity}</div>
                                <div className="text-sm text-gray-600">{mockOrder.currency}{item.price} each</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-black mb-4">Payment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Method</div>
                        <div className="text-black font-medium">{mockOrder.payment.method}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <div className="text-black font-medium">{mockOrder.payment.status}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
                        <div className="text-black font-mono text-sm">{mockOrder.payment.transactionId}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
