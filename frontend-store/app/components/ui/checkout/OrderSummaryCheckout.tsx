/**
 * Order Summary for Checkout
 * Displays cart items and order totals in checkout flow
 */

"use client";

import { useState, useEffect } from 'react';
import { logError } from '@/lib/logger';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { settingsApi } from '@/lib/api/settings';
import { calculateShipping, type ShippingZone } from '@/lib/app/utils/shippingCalculation';
import { calculateTax, calculateTotal, type TaxSettings } from '@/lib/app/utils/taxCalculation';

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
    pincode?: string; // Optional: only available after address selection
}

export function OrderSummaryCheckout({ items, pincode }: OrderSummaryCheckoutProps) {
    const [zones, setZones] = useState<ShippingZone[]>([]);
    const [taxSettings, setTaxSettings] = useState<TaxSettings>({
        enabled: true,
        rate: 18,
        label: 'GST',
        inclusive: false
    });
    const [isLoading, setIsLoading] = useState(true);

    // Calculate totalPrice from items
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Fetch shipping zones and tax settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsApi.getPublicSettings();
                if (data && data['shipping']) {
                    if (data['shipping'].zones) {
                        setZones(data['shipping'].zones);
                    }
                    if (data['shipping'].tax) {
                        setTaxSettings(data['shipping'].tax);
                    }
                }
            } catch (error) {
                logError(error, 'Failed to load shipping settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Calculate shipping (only if pincode is provided)
    const shipping = pincode && zones.length > 0
        ? calculateShipping(pincode, totalPrice, zones)
        : null;

    // Calculate tax
    const tax = calculateTax(totalPrice, taxSettings);

    // Calculate final total
    const finalTotal = calculateTotal(totalPrice, taxSettings, shipping?.cost || 0);

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

                    {/* Shipping */}
                    <div className="flex justify-between text-[12px] sm:text-[13px]">
                        <span className="text-white/60">Shipping</span>
                        {isLoading ? (
                            <span className="text-white/40 text-[12px]">Loading...</span>
                        ) : shipping ? (
                            shipping.isFree ? (
                                <span className="text-green-400">FREE</span>
                            ) : (
                                <span className="text-white">₹{shipping.cost.toFixed(2)}</span>
                            )
                        ) : (
                            <span className="text-white/55 text-[12px]">Select address to calculate</span>
                        )}
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-white/60">Tax ({tax.label})</span>
                        {tax.isInclusive ? (
                            <span className="text-white/40 text-xs">Included in price</span>
                        ) : (
                            <span className="text-white">₹{tax.amount.toFixed(2)}</span>
                        )}
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
