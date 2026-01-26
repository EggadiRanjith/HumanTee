/**
 * Order Detail Page
 * Displays complete order information with status update functionality
 */

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    subtotal?: number;
    taxAmount?: number;
    shippingAmount?: number;
    discountAmount?: number;
    address: {
        fullName: string;
        email: string;
        phone: string;
        addressLine1?: string;
        addressLine2?: string;
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
        providerPaymentId?: string;
        providerOrderId?: string;
        createdAt: string;
    }>;
    statusHistory?: Array<{
        id: string;
        fromStatus: string | null;
        toStatus: string;
        changedBy: string;
        reason: string;
        createdAt: string;
    }>;
    shipments?: Array<{
        id: string;
        carrier?: string;
        trackingNumber?: string;
        status: string;
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
        // Payment statuses
        initiated: 'bg-gray-100 text-gray-800 border-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        authorized: 'bg-blue-100 text-blue-800 border-blue-200',
        captured: 'bg-green-100 text-green-800 border-green-200',
        failed: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const queryClient = useQueryClient();

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

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
    useEffect(() => {
        if (order) {
            setNewStatus(order.status);
        }
    }, [order]);

    const handleStatusUpdate = async () => {
        if (!order || newStatus === order.status) {
            setShowStatusModal(false);
            return;
        }

        setIsUpdating(true);
        setUpdateError(null);
        try {
            await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
            // Invalidate orders list cache so list page shows updated status
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await refetch();
            setShowStatusModal(false);
        } catch (err: any) {
            // Extract error message from backend response
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update status';
            setUpdateError(errorMessage);
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
                    <p className="text-red-600 mb-4">{error instanceof Error ? error.message : (error as any)?.message || 'Order not found'}</p>
                    <Link href="/admin/orders" className="text-black hover:underline">
                        ← Back to orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header - Compact Mobile */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
                <div>
                    <Link href="/admin/orders" className="text-xs md:text-sm text-gray-600 hover:text-black mb-2 inline-block">
                        ← Back to orders
                    </Link>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-black">Order {order.orderNumber}</h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
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
                        className="bg-black hover:bg-gray-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm"
                    >
                        Update Status
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-100 hover:bg-gray-200 text-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm"
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    {/* Order Items - Enhanced with SKU */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 lg:p-6">
                        <h2 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">Order Items</h2>
                        <div className="space-y-3 md:space-y-4">
                            {order.items.map((item: any, index: number) => {
                                const price = Number(item.unitPrice || 0);
                                const quantity = Number(item.quantity || 0);
                                const subtotal = Number(item.lineTotal || price * quantity);

                                return (
                                    <div key={item.id || index} className="flex gap-3 md:gap-4 pb-3 md:pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {item.imageUrlSnapshot ? (
                                                <img
                                                    src={item.imageUrlSnapshot.startsWith('data:') ? item.imageUrlSnapshot : item.imageUrlSnapshot}
                                                    alt={item.productNameSnapshot}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xl md:text-2xl">📦</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-black text-sm md:text-base truncate">{item.productNameSnapshot}</h3>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                {item.variantLabelSnapshot && (
                                                    <p className="text-xs md:text-sm text-gray-600">Variant: {item.variantLabelSnapshot}</p>
                                                )}
                                                {item.skuSnapshot && (
                                                    <p className="text-xs text-gray-500 font-mono">SKU: {item.skuSnapshot}</p>
                                                )}
                                                <p className="text-xs md:text-sm text-gray-600 mt-1">Qty: {quantity} × ₹{price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-semibold text-black text-sm md:text-base">₹{subtotal.toLocaleString()}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Financial Breakdown - CRITICAL ADDITION */}
                        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{Number(order.subtotal || 0).toLocaleString()}</span>
                            </div>
                            {Number(order.taxAmount || 0) > 0 && (
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (GST)</span>
                                    <span>₹{Number(order.taxAmount).toLocaleString()}</span>
                                </div>
                            )}
                            {Number(order.shippingAmount || 0) > 0 && (
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>₹{Number(order.shippingAmount).toLocaleString()}</span>
                                </div>
                            )}
                            {Number(order.discountAmount || 0) > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{Number(order.discountAmount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base md:text-lg font-semibold text-black pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{Number(order.totalAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status History Timeline - CRITICAL ADDITION */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg font-semibold text-black mb-4">Order Timeline</h2>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                <div className="space-y-4">
                                    {order.statusHistory.map((history: any, index: number) => (
                                        <div key={history.id || index} className="relative flex gap-4">
                                            {/* Timeline dot */}
                                            <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${index === (order.statusHistory?.length ?? 0) - 1
                                                ? 'bg-green-100 border-2 border-green-500'
                                                : 'bg-gray-100 border-2 border-gray-300'
                                                }`}>
                                                <div className={`w-3 h-3 rounded-full ${index === (order.statusHistory?.length ?? 0) - 1 ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></div>
                                            </div>

                                            {/* Timeline content */}
                                            <div className="flex-1 pb-4">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div>
                                                        {history.fromStatus && (
                                                            <p className="text-xs text-gray-500">
                                                                {formatStatus(history.fromStatus)}
                                                                <span className="mx-1">→</span>
                                                            </p>
                                                        )}
                                                        <p className={`text-sm font-semibold ${index === order.statusHistory.length - 1 ? 'text-green-600' : 'text-gray-900'
                                                            }`}>
                                                            {formatStatus(history.toStatus)}
                                                        </p>
                                                    </div>
                                                    <time className="text-xs text-gray-500 flex-shrink-0">
                                                        {new Date(history.createdAt).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </time>
                                                </div>
                                                {history.reason && (
                                                    <p className="text-xs text-gray-600 mt-1 italic">
                                                        {history.reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Information */}
                    {order.payments && order.payments.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg font-semibold text-black mb-4">Payment Information</h2>
                            {order.payments.map((payment) => (
                                <div key={payment.id} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Status</span>
                                        <span className={`px-3 py-1.5 text-sm font-medium rounded border ${getStatusColor(payment.status)}`}>
                                            {payment.status === 'captured' ? '✅ ' : ''}{formatStatus(payment.status)}
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
                                    {payment.providerPaymentId && (
                                        <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">Razorpay Payment ID</span>
                                            <div className="flex items-center gap-2">
                                                <code className="text-sm font-mono text-black bg-gray-50 px-2 py-1 rounded flex-1">{payment.providerPaymentId}</code>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(payment.providerPaymentId!)}
                                                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                                    title="Copy Payment ID"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {payment.providerOrderId && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-gray-500">Razorpay Order ID</span>
                                            <code className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">{payment.providerOrderId}</code>
                                        </div>
                                    )}
                                    {payment.transactionId && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Transaction ID</span>
                                            <span className="text-sm font-mono text-black">{payment.transactionId}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                                        <span>Payment Date</span>
                                        <span>{new Date(payment.createdAt).toLocaleString()}</span>
                                    </div>
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
                        <div className="text-sm text-gray-700 space-y-1.5">
                            <div className="font-medium text-black">{order.address.fullName}</div>
                            {order.address.addressLine1 && <div>{order.address.addressLine1}</div>}
                            {order.address.addressLine2 && <div>{order.address.addressLine2}</div>}
                            {order.address.landmark && <div className="text-gray-600">Near: {order.address.landmark}</div>}
                            <div>{order.address.city}, {order.address.state} {order.address.postalCode}</div>
                            <div>{order.address.country || 'India'}</div>
                            <div className="pt-2 border-t border-gray-100 mt-2">
                                <div className="text-gray-600">📞 {order.address.phone}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal - Compact Mobile */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 md:p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
                        <h2 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">Update Order Status</h2>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none mb-3 md:mb-4 text-sm"
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Error Message */}
                        {updateError && (
                            <div className="mb-3 md:mb-4 p-2.5 md:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs md:text-sm">
                                <strong>Error:</strong> {updateError}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm"
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="flex-1 bg-black hover:bg-gray-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium disabled:opacity-50 text-xs md:text-sm"
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
