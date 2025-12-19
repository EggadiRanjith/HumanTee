/**
 * Cart Summary Component
 * Order summary with totals and checkout buttons
 */

"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CartSummaryProps {
    subtotal: number;
    totalItems: number;
    onCheckout: () => void;
}

export function CartSummary({ subtotal, totalItems, onCheckout }: CartSummaryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="
        p-6 rounded-2xl luxury-glass
        border border-white/10 bg-white/5 backdrop-blur-xl
        sticky top-24
      "
        >
            <h2 className="text-white text-lg font-light uppercase tracking-wide mb-6">
                Order Summary
            </h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Shipping</span>
                    <span className="text-white">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tax</span>
                    <span className="text-white">Calculated at checkout</span>
                </div>
            </div>

            <div className="h-px bg-white/10 mb-6" />

            <div className="flex justify-between mb-6">
                <span className="text-white text-lg font-light">Total</span>
                <span className="text-white text-xl font-light">₹{subtotal.toFixed(2)}</span>
            </div>

            <button
                onClick={onCheckout}
                className="
          w-full py-4 rounded-full
          bg-white text-black
          text-xs uppercase tracking-[0.18em] font-medium
          hover:bg-white/90 transition-colors
          mb-3
        "
            >
                Proceed to Checkout
            </button>

            <Link
                href="/shop"
                className="
          block w-full py-3 rounded-full text-center
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
