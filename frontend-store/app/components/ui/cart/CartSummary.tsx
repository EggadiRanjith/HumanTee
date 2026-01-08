/**
 * Cart Summary Component
 * Order summary with totals and checkout buttons
 */

"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { AppliedDiscount } from '@/app/types/discount.types';

interface CartSummaryProps {
    subtotal: number;
    totalItems: number;
    onCheckout: () => void;
    discount?: AppliedDiscount | null;
    total?: number;
}

export function CartSummary({ subtotal, totalItems, onCheckout, discount, total }: CartSummaryProps) {
    const finalTotal = total !== undefined ? total : subtotal;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
        >
            {/* Pricing Breakdown */}
            <div className="space-y-3 w-full overflow-x-auto">
                <div className="flex justify-between items-center gap-3 min-w-0">
                    <span className="text-white/60 text-xs sm:text-sm flex-shrink-0">Subtotal</span>
                    <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount && (
                    <div className="flex justify-between items-center gap-3 min-w-0">
                        <span className="text-green-400 text-xs sm:text-sm flex items-center gap-1 flex-shrink min-w-0">
                            <span className="truncate">Discount ({discount.code})</span>
                            <span className="text-[10px] flex-shrink-0">✨</span>
                        </span>
                        <span className="text-green-400 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">-₹{discount.discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between items-start gap-3 min-w-0">
                    <span className="text-white/60 text-xs sm:text-sm flex-shrink-0">Shipping</span>
                    <span className="text-white/40 text-[10px] sm:text-xs text-right break-words max-w-[60%]">Enter address to calculate</span>
                </div>

                <div className="flex justify-between items-start gap-3 min-w-0">
                    <span className="text-white/60 text-xs sm:text-sm flex-shrink-0">Tax (GST)</span>
                    <span className="text-white/60 text-[10px] sm:text-xs text-right break-words max-w-[60%]">Calculated at checkout</span>
                </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Total */}
            <div className="flex justify-between items-center gap-3 py-2">
                <span className="text-white text-sm sm:text-base lg:text-lg font-medium flex-shrink-0">Total</span>
                <span className="text-white text-base sm:text-lg lg:text-xl font-semibold min-w-0 text-right">₹{finalTotal.toFixed(2)}</span>
            </div>

            {/* Savings Badge */}
            {discount && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 text-xs text-center">
                        🎉 You're saving ₹{discount.discountAmount.toFixed(2)}!
                    </p>
                </div>
            )}

            {/* Checkout Button */}
            <button
                onClick={onCheckout}
                aria-label={`Proceed to checkout with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
                className="
                    w-full py-3 sm:py-4 rounded-full
                    bg-white text-black
                    text-xs uppercase tracking-[0.18em] font-medium
                    hover:bg-white/90 transition-colors
                "
            >
                Proceed to Checkout
            </button>

            {/* Continue Shopping Link */}
            <Link
                href="/shop"
                className="
                    block w-full py-2.5 sm:py-3 rounded-full text-center
                    border border-white/10 luxury-glass
                    text-white/70 text-xs uppercase tracking-[0.18em]
                    hover:text-white hover:bg-white/5 transition-colors
                "
            >
                Continue Shopping
            </Link>
        </motion.div>
    );
}
