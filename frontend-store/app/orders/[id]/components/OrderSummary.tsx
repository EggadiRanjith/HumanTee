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
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                        {address.fullName}<br />
                        {address.addressLine1}<br />
                        {address.addressLine2 && <>{address.addressLine2}<br /></>}
                        {address.city}, {address.state}<br />
                        {address.postalCode}, {address.country}
                    </p>
                </div>

                {/* Payment Method */}
                <div className="p-4 sm:p-5 rounded-lg sm:rounded-xl luxury-glass border border-white/10 bg-white/5">
                    <h3 className="text-white/70 text-[10px] sm:text-xs uppercase tracking-[0.18em] mb-2">
                        Payment Method
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">
                        {payments?.[0]?.paymentMethod || 'Razorpay'}
                    </p>
                    <p className="text-white/60 text-[10px] sm:text-xs mt-1">
                        Status: {payments?.[0]?.status || 'Captured'}
                    </p>
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
