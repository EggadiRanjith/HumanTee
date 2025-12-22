'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { FiMessageSquare, FiExternalLink, FiAlertCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';

type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed';

interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    createdAt: string;
    items: any[];
    address: any;
    payments: any[];
    statusHistory?: any[];
    shipments?: any[];
    tickets?: any[];
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showShipmentModal, setShowShipmentModal] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(`/admin/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            case 'shipped':
                return 'bg-purple-100 text-purple-700';
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
            case 'payment_failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatStatus = (status: OrderStatus) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 hover:text-black">
                        ← Back
                    </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 hover:text-black">
                        ← Back
                    </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <h3 className="text-lg font-medium text-black mb-2">Order not found</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 hover:text-black">
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-black">{order.orderNumber}</h1>
                        <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStatusModal(true)}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
                    >
                        Update Status
                    </button>
                    <button
                        onClick={() => setShowShipmentModal(true)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                        Add Shipment
                    </button>
                </div>
            </div>

            {/* Tickets Warning/Link */}
            {order.tickets && order.tickets.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                            <FiMessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wider">Active Support Tickets</h3>
                            <p className="text-sm text-orange-700 mt-0.5">There are {order.tickets.length} support requests linked to this order.</p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/tickets?search=${order.orderNumber}`}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                        Handle Tickets <FiExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Order Status</p>
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-semibold text-black">₹{Number(order.totalAmount).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-black mb-4">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-black">{order.address.fullName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-black">{order.address.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-black">{order.address.phone}</p>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-black mb-4">Shipping Address</h2>
                <p className="text-black">{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p className="text-black">{order.address.addressLine2}</p>}
                <p className="text-black">{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p className="text-black">{order.address.country}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-black mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                            <img
                                src={item.imageUrlSnapshot || '/placeholder.png'}
                                alt={item.productNameSnapshot}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-black">{item.productNameSnapshot}</p>
                                <p className="text-sm text-gray-600">{item.variantLabelSnapshot}</p>
                                <p className="text-sm text-gray-600">SKU: {item.skuSnapshot}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-black">₹{Number(item.lineTotal).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">₹{Number(item.unitPrice).toLocaleString()} each</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-black">₹{Number(order.subtotal).toLocaleString()}</span>
                    </div>
                    {order.taxAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-black">₹{Number(order.taxAmount).toLocaleString()}</span>
                        </div>
                    )}
                    {order.shippingAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-black">₹{Number(order.shippingAmount).toLocaleString()}</span>
                        </div>
                    )}
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600">-₹{Number(order.discountAmount).toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                        <span className="text-black">Total</span>
                        <span className="text-black">₹{Number(order.totalAmount).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Shipment Info */}
            {order.shipments && order.shipments.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Shipment Tracking</h2>
                    {order.shipments.map((shipment: any) => (
                        <div key={shipment.id} className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Carrier</span>
                                <span className="text-black">{shipment.carrier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tracking Number</span>
                                <span className="text-black font-mono">{shipment.trackingNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Shipped At</span>
                                <span className="text-black">{new Date(shipment.shippedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && (
                <StatusUpdateModal
                    order={order}
                    onClose={() => setShowStatusModal(false)}
                    onSuccess={() => {
                        setShowStatusModal(false);
                        fetchOrder();
                    }}
                />
            )}

            {/* Shipment Modal */}
            {showShipmentModal && (
                <ShipmentModal
                    orderId={order.id}
                    onClose={() => setShowShipmentModal(false)}
                    onSuccess={() => {
                        setShowShipmentModal(false);
                        fetchOrder();
                    }}
                />
            )}
        </div>
    );
}

// Status Update Modal Component
function StatusUpdateModal({ order, onClose, onSuccess }: any) {
    const [status, setStatus] = useState(order.status);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await apiClient.patch(`/admin/orders/${order.id}/status`, {
                status,
                reason: reason || undefined,
            });
            onSuccess();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update status');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold text-black mb-4">Update Order Status</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                            required
                        >
                            <option value="pending_payment">Pending Payment</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                            rows={3}
                            placeholder="Enter reason for status change..."
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Shipment Modal Component
function ShipmentModal({ orderId, onClose, onSuccess }: any) {
    const [carrier, setCarrier] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await apiClient.patch(`/admin/orders/${orderId}/shipment`, {
                carrier,
                trackingNumber,
                notes: notes || undefined,
            });
            onSuccess();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to add shipment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold text-black mb-4">Add Shipment Tracking</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Carrier
                        </label>
                        <input
                            type="text"
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                            placeholder="e.g., FedEx, DHL, Blue Dart"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tracking Number
                        </label>
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                            placeholder="Enter tracking number"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                            rows={3}
                            placeholder="Additional notes..."
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Shipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
