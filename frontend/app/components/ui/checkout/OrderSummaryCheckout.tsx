/**
 * Order Summary for Checkout
 * Displays cart items and order totals in checkout flow
 */

"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

interface CartItem {
    id: number;
    title: string;
    subtitle: string;
    price: string;
    image: string;
    size: string;
    quantity: number;
}

interface OrderSummaryCheckoutProps {
    items: CartItem[];
    totalPrice: number;
}

export function OrderSummaryCheckout({ items, totalPrice }: OrderSummaryCheckoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
        >
            <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl luxury-glass border border-white/10 lg:sticky lg:top-24">
                <h2 className="text-white text-sm sm:text-base font-light mb-3 sm:mb-4 uppercase tracking-wide">
                    Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-[200px] sm:max-h-60 overflow-y-auto">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-3">
                            <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 56px, 64px"
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs sm:text-sm truncate">{item.title}</p>
                                <p className="text-white/60 text-[10px] sm:text-xs">Size: {item.size}</p>
                                <p className="text-white/60 text-[10px] sm:text-xs">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-white text-xs sm:text-sm font-medium">{item.price}</p>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/60">Subtotal</span>
                        <span className="text-white">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/60">Shipping</span>
                        <span className="text-white">Free</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-light pt-2 border-t border-white/10">
                        <span className="text-white">Total</span>
                        <span className="text-white font-medium">₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
