/**
 * Order Detail Page
 * Displays complete order information with status update functionality
 */

'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    variantId: string;
    productNameSnapshot: string;
    variantLabelSnapshot?: string;
    skuSnapshot?: string;
    imageUrlSnapshot?: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    discountAmount: number;
    lineTotal: number;
    createdAt: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
    address: {
        fullName: string;
        email: string;
        phone: string;
        address?: string;
        houseNumber?: string;
        landmark?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    items: OrderItem[];
    payments?: Array<{
        id: string;
        status: string;
        paymentMethod: string;
        amount: number;
        transactionId?: string;
        createdAt: string;
    }>;
}

const STATUS_OPTIONS = [
    { value: 'pending_payment', label: 'Pending Payment' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        processing: 'bg-blue-100 text-blue-800 border-blue-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        payment_failed: 'bg-red-100 text-red-800 border-red-200',
        paid: 'bg-green-100 text-green-800 border-green-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch order details using React Query
    const { data: order, isLoading, error, refetch } = useQuery<Order>({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/orders/${orderId}`);
            return response.data;
        },
        enabled: !!orderId,
    });

    // Set initial status when order loads
    useState(() => {
        if (order) {
            setNewStatus(order.status);
        }
    });

    const handleStatusUpdate = async () => {
        if (!order || newStatus === order.status) {
            setShowStatusModal(false);
            return;
        }

        setIsUpdating(true);
        try {
            await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
            await refetch();
            setShowStatusModal(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
                    <Link href="/admin/orders" className="text-black hover:underline">
                        ← Back to orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                    <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-black mb-2 inline-block">
                        ← Back to orders
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-semibold text-black">Order {order.orderNumber}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStatusModal(true)}
                        className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        Update Status
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => {
                                // Debug: Log the actual item structure (only first item)
                                if (index === 0) {
                                    console.log('Order item structure:', item);
                                    console.log('Available fields:', Object.keys(item));
                                }

                                // Handle different possible field names from API
                                const price = Number(item.unitPrice || 0);
                                const quantity = Number(item.quantity || 0);
                                const subtotal = Number(item.lineTotal || price * quantity);

                                return (
                                    <div key={item.id || index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            {item.imageUrlSnapshot ? (
                                                <img src={item.imageUrlSnapshot} alt={item.productNameSnapshot} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <span className="text-2xl">📦</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-black">{item.productNameSnapshot}</h3>
                                            {item.variantLabelSnapshot && (
                                                <p className="text-sm text-gray-600 mt-1">{item.variantLabelSnapshot}</p>
                                            )}
                                            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-black">₹{subtotal.toLocaleString()}</div>
                                            <div className="text-sm text-gray-500">₹{price.toLocaleString()} each</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-lg font-semibold text-black">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    {order.payments && order.payments.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg font-semibold text-black mb-4">Payment Information</h2>
                            {order.payments.map((payment) => (
                                <div key={payment.id} className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Status</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(payment.status)}`}>
                                            {formatStatus(payment.status)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Method</span>
                                        <span className="text-sm text-black">{payment.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Amount</span>
                                        <span className="text-sm font-medium text-black">₹{payment.amount.toLocaleString()}</span>
                                    </div>
                                    {payment.transactionId && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Transaction ID</span>
                                            <span className="text-sm font-mono text-black">{payment.transactionId}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Order Status</h2>
                        <span className={`inline-block px-3 py-2 text-sm font-medium rounded-lg border ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                        </span>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Customer</h2>
                        <div className="space-y-2">
                            <div>
                                <div className="text-sm font-medium text-black">{order.address.fullName}</div>
                                <div className="text-sm text-gray-600">{order.address.email}</div>
                                <div className="text-sm text-gray-600">{order.address.phone}</div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Shipping Address</h2>
                        <div className="text-sm text-gray-600 space-y-1">
                            {order.address.houseNumber && <div>{order.address.houseNumber}</div>}
                            {order.address.address && <div>{order.address.address}</div>}
                            {order.address.landmark && <div>Landmark: {order.address.landmark}</div>}
                            <div>{order.address.city}, {order.address.state} {order.address.postalCode}</div>
                            <div>{order.address.country || 'India'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Update Order Status</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none mb-4"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-medium"
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="flex-1 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
