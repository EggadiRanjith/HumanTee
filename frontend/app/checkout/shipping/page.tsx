"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ShippingPage() {
    const router = useRouter();
    const { items, totalPrice } = useCart();
    const { shippingData, setShippingData } = useCheckout();
    const { setLoading } = useLoading();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateShipping = () => {
        const newErrors: Record<string, string> = {};

        if (!shippingData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!shippingData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(shippingData.email)) newErrors.email = "Invalid email format";
        if (!shippingData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!shippingData.address.trim()) newErrors.address = "Address is required";
        if (!shippingData.city.trim()) newErrors.city = "City is required";
        if (!shippingData.state.trim()) newErrors.state = "State is required";
        if (!shippingData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinueToPayment = () => {
        if (validateShipping()) {
            setLoading(true);
            router.push("/checkout/payment");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center px-4">
                <div className="text-center max-w-md w-full">
                    <p className="text-white/60 text-base sm:text-lg mb-4">Your cart is empty</p>
                    <button
                        onClick={() => router.push("/shop")}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[44px]"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
                <div className="py-8 sm:py-10 md:py-12">
                    {/* Progress Indicator - Elite Mobile Responsive */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-4 max-w-2xl mx-auto">
                            {/* Step 1 - Active */}
                            <div className="flex items-center flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center text-xs sm:text-sm md:text-base font-medium shadow-lg">
                                    1
                                </div>
                                <span className="ml-1.5 sm:ml-2 text-white text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider font-medium">Ship</span>
                            </div>
                            <div className="flex-1 h-px bg-white/20 min-w-[20px] max-w-[60px] sm:max-w-[80px]"></div>
                            {/* Step 2 */}
                            <div className="flex items-center flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 text-white/40 flex items-center justify-center text-xs sm:text-sm md:text-base font-medium">
                                    2
                                </div>
                                <span className="ml-1.5 sm:ml-2 text-white/40 text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Pay</span>
                            </div>
                            <div className="flex-1 h-px bg-white/20 min-w-[20px] max-w-[60px] sm:max-w-[80px]"></div>
                            {/* Step 3 */}
                            <div className="flex items-center flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 text-white/40 flex items-center justify-center text-xs sm:text-sm md:text-base font-medium">
                                    3
                                </div>
                                <span className="ml-1.5 sm:ml-2 text-white/40 text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">Done</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 sm:mb-5 uppercase tracking-wide text-center sm:text-left">Shipping Address</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Shipping Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-2 space-y-3 sm:space-y-5"
                        >
                            <div className="p-3 sm:p-5 md:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10">
                                <div className="space-y-3">
                                    {/* Full Name */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={shippingData.fullName}
                                            onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                        />
                                        {errors.fullName && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.fullName}</p>}
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={shippingData.email}
                                                onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                            />
                                            {errors.email && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={shippingData.phone}
                                                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                            />
                                            {errors.phone && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Address"
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                        />
                                        {errors.address && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.address}</p>}
                                    </div>

                                    {/* City, State, Postal Code */}
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="xs:col-span-2 sm:col-span-1">
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={shippingData.city}
                                                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                            />
                                            {errors.city && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="State"
                                                value={shippingData.state}
                                                onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                            />
                                            {errors.state && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.state}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Postal Code"
                                                value={shippingData.postalCode}
                                                onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                                                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                            />
                                            {errors.postalCode && <p className="text-red-400 text-[10px] sm:text-xs mt-1">{errors.postalCode}</p>}
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            value={shippingData.country}
                                            onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                                            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base placeholder:text-white/40 focus:border-white/30 focus:outline-none transition-colors min-h-[44px] sm:min-h-[48px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Continue Button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleContinueToPayment}
                                className="w-full py-3.5 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base uppercase tracking-wider font-medium hover:bg-white/90 transition-colors min-h-[48px] sm:min-h-[52px]"
                            >
                                Continue to Payment
                            </motion.button>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        router.push("/cart");
                                    }}
                                    className="text-white/40 hover:text-white text-xs uppercase tracking-wider transition-colors"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        </motion.div>

                        {/* Order Summary - Sticky on Desktop, Fixed on Mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl luxury-glass border border-white/10 lg:sticky lg:top-24">
                                <h2 className="text-white text-sm sm:text-base font-light mb-3 sm:mb-4 uppercase tracking-wide">Order Summary</h2>

                                <div className="space-y-3 mb-6 max-h-[200px] sm:max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex gap-3">
                                            <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
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
                    </div>
                </div>
            </div>
        </div>
    );
}
