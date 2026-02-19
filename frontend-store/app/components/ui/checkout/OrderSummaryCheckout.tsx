/**
 * Order Summary for Checkout
 * Displays cart items and order totals in checkout flow
 * Shipping cost fetched from backend (Delhivery rate / zone table)
 */

"use client";

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import apiClient from '@/lib/api-client';

interface CartItem {
    id: number | string;
    title: string;
    subtitle?: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

interface OrderSummaryCheckoutProps {
    items: CartItem[];
    pincode?: string;
    appliedDiscount?: { code: string; discountAmount: number } | null;
    discountedTotal?: number;
}

export function OrderSummaryCheckout({ items, pincode, appliedDiscount, discountedTotal }: OrderSummaryCheckoutProps) {
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [shippingLoading, setShippingLoading] = useState(false);

    const totalPrice = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    // Fetch shipping rate from backend when pincode is available
    useEffect(() => {
        if (!pincode || pincode.length !== 6) {
            setShippingCost(null);
            return;
        }

        let cancelled = false;
        setShippingLoading(true);

        apiClient.get('/orders/shipping-estimate', {
            params: { pincode, cartTotal: totalPrice },
        })
            .then((res) => {
                if (!cancelled) {
                    setShippingCost(res.data.shippingCost ?? 0);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setShippingCost(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setShippingLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [pincode, totalPrice]);

    const isFreeShipping = shippingCost === 0;

    // Calculate final total
    let finalTotal = totalPrice;
    if (shippingCost !== null) finalTotal += shippingCost;
    if (appliedDiscount) finalTotal -= appliedDiscount.discountAmount;

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
                                {item.subtitle && <p className="text-white/60 text-[10px] sm:text-xs truncate">{item.subtitle}</p>}
                                {item.size && <p className="text-white/60 text-[10px] sm:text-xs">Size: {item.size}</p>}
                                <p className="text-white/60 text-[10px] sm:text-xs">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-white text-xs sm:text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/60">Subtotal</span>
                        <span className="text-white">₹{totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Discount */}
                    {appliedDiscount && (
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-green-400">Discount ({appliedDiscount.code})</span>
                            <span className="text-green-400">-₹{appliedDiscount.discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {/* Shipping */}
                    <div className="flex justify-between text-[12px] sm:text-[13px]">
                        <span className="text-white/60">Shipping</span>
                        {shippingLoading ? (
                            <span className="text-white/40 text-[12px]">Calculating...</span>
                        ) : shippingCost !== null ? (
                            isFreeShipping ? (
                                <span className="text-green-400">FREE</span>
                            ) : (
                                <span className="text-white">₹{shippingCost.toFixed(2)}</span>
                            )
                        ) : (
                            <span className="text-white/55 text-[12px]">Select address to calculate</span>
                        )}
                    </div>

                    {/* Tax - GST is inclusive in MRP */}
                    <div className="flex justify-between text-[11px] sm:text-xs">
                        <span className="text-white/40">Tax (GST)</span>
                        <span className="text-white/40">All taxes included</span>
                    </div>

                    <div className="flex justify-between text-base sm:text-lg font-light pt-2 border-t border-white/10">
                        <span className="text-white">Total</span>
                        <span className="text-white font-medium">₹{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
