/**
 * Order Summary Component
 * Displays shipping, payment info, and price breakdown
 */

import { Address, Payment } from '../../types';

interface OrderSummaryProps {
    address?: Address;
    payments?: Payment[];
    subtotal?: number;
    shippingAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
    totalAmount: number;
}

export function OrderSummary({
    address,
    payments,
    subtotal = 0,
    shippingAmount = 0,
    taxAmount = 0,
    discountAmount = 0,
    totalAmount
}: OrderSummaryProps) {
    if (!address) return null;

    return (
        <>
            {/* Shipping & Payment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10">
                {/* Shipping Address */}
                <div className="p-4 sm:p-5 rounded-lg sm:rounded-xl luxury-glass border border-white/10 bg-white/5">
                    <h3 className="text-white/70 text-[10px] sm:text-xs uppercase tracking-[0.18em] mb-2">
                        Shipping Address
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed break-words">
                        <span className="block truncate">{address.fullName}</span>
                        <span className="block truncate">{address.addressLine1}</span>
                        {address.addressLine2 && <span className="block truncate">{address.addressLine2}</span>}
                        <span className="block truncate">{address.city}, {address.state}</span>
                        <span className="block truncate">{address.postalCode}, {address.country}</span>
                    </p>
                </div>

                {/* Payment Method */}
                <div className="p-4 sm:p-5 rounded-lg sm:rounded-xl luxury-glass border border-white/10 bg-white/5">
                    <h3 className="text-white/70 text-[10px] sm:text-xs uppercase tracking-[0.18em] mb-2">
                        Payment Information
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">
                        {payments?.[0]?.paymentMethod || 'Razorpay'}
                    </p>

                    {/* Payment Status */}
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-white/60 text-[10px] sm:text-xs">Status:</span>
                        {payments?.[0]?.status?.toUpperCase() === 'CAPTURED' ? (
                            <span className="text-green-400 text-[10px] sm:text-xs font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Payment Successful
                            </span>
                        ) : payments?.[0]?.status?.toUpperCase() === 'FAILED' ? (
                            <span className="text-red-400 text-[10px] sm:text-xs font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Payment Failed
                            </span>
                        ) : (
                            <span className="text-yellow-400 text-[10px] sm:text-xs font-medium">
                                {payments?.[0]?.status || 'Processing'}
                            </span>
                        )}
                    </div>

                    {/* Payment ID */}
                    {payments?.[0]?.id && (
                        <p className="text-white/40 text-[9px] sm:text-[10px] mt-2 font-mono truncate">
                            ID: {payments[0].id.slice(0, 20)}...
                        </p>
                    )}
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl luxury-glass border border-white/10 bg-white/5 space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex justify-between text-white/70 text-xs sm:text-sm">
                    <span>Subtotal</span>
                    <span>₹{Number(subtotal).toFixed(2)}</span>
                </div>

                {shippingAmount > 0 && (
                    <div className="flex justify-between text-white/70 text-xs sm:text-sm">
                        <span>Shipping</span>
                        <span>₹{Number(shippingAmount).toFixed(2)}</span>
                    </div>
                )}

                {taxAmount > 0 && (
                    <div className="flex justify-between text-white/70 text-xs sm:text-sm">
                        <span>Tax</span>
                        <span>₹{Number(taxAmount).toFixed(2)}</span>
                    </div>
                )}

                {discountAmount > 0 && (
                    <div className="flex justify-between text-green-400 text-xs sm:text-sm">
                        <span>Discount</span>
                        <span>-₹{Number(discountAmount).toFixed(2)}</span>
                    </div>
                )}

                <div className="border-t border-white/10 pt-2.5 sm:pt-3 flex justify-between text-white text-base sm:text-lg tracking-wide font-light">
                    <span>Total</span>
                    <span>₹{Number(totalAmount).toFixed(2)}</span>
                </div>
            </div>
        </>
    );
}
