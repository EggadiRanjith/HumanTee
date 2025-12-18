"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { useAuth } from "@/app/context/AuthContext";
import { CheckoutProgress, OrderSummaryCheckout } from "@/app/components/ui/checkout";
import { GradientOverlay } from "@/app/components/ui/layout";
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";

export default function ShippingPage() {
    const router = useRouter();
    const { items, totalPrice } = useCart();
    const { shippingData, setShippingData } = useCheckout();
    const { setLoading } = useLoading();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    // CRITICAL: Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Check profile completeness on mount
    useEffect(() => {
        const checkProfile = async () => {
            if (!user) {
                setIsCheckingProfile(false);
                return;
            }

            try {
                const response = await apiClient.get('/auth/me');
                setProfileComplete(response.data.profileComplete);
            } catch (error) {
                console.error('Failed to check profile:', error);
                setProfileComplete(false);
            } finally {
                setIsCheckingProfile(false);
            }
        };

        checkProfile();
    }, [user]);

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

    // Loading state while checking profile
    if (isCheckingProfile) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Checking profile...</p>
                </div>
            </div>
        );
    }

    // Profile incomplete - BLOCK CHECKOUT
    if (profileComplete === false) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center px-4">
                <GradientOverlay variant="violet" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative text-center max-w-md w-full"
                >
                    <div className="p-8 rounded-2xl luxury-glass border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                        <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                            <span className="text-amber-400 text-4xl">⚠️</span>
                        </div>
                        <h2 className="text-white text-2xl font-light mb-3 uppercase tracking-wide">Profile Incomplete</h2>
                        <p className="text-white/70 text-sm mb-6 leading-relaxed">
                            Please complete your profile with your name and phone number before proceeding to checkout.
                        </p>
                        <button
                            onClick={() => {
                                setLoading(true);
                                router.push("/account");
                            }}
                            className="w-full px-8 py-4 bg-white text-black rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-colors font-semibold"
                        >
                            Complete Profile
                        </button>
                        <button
                            onClick={() => {
                                setLoading(true);
                                router.push("/cart");
                            }}
                            className="w-full mt-3 px-8 py-3 bg-white/10 text-white rounded-full text-sm uppercase tracking-wider hover:bg-white/20 transition-colors"
                        >
                            Back to Cart
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

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
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
                <div className="py-8 sm:py-10 md:py-12">
                    {/* Progress Indicator */}
                    <CheckoutProgress currentStep={1} />

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

                        {/* Order Summary */}
                        <OrderSummaryCheckout items={items} totalPrice={totalPrice} />
                    </div>
                </div>
            </div>
        </div>
    );
}
