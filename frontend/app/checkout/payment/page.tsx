"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { useAuth } from "@/app/context/AuthContext";
import { CheckoutProgress, OrderSummaryCheckout } from "@/app/components/ui/checkout";
import { GradientOverlay } from "@/app/components/ui/layout";
import { FiCreditCard, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PaymentPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { paymentMethod, setPaymentMethod, setOrderNumber, shippingData } = useCheckout();
    const { setLoading } = useLoading();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    // CRITICAL: Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Check if shipping data is complete
    const hasShippingData = shippingData.fullName && shippingData.email && shippingData.address;

    if (!hasShippingData) {
        router.push("/checkout/shipping");
        return null;
    }

    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check demo mode
        const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

        // Generate order number
        const orderNum = demoMode
            ? `DEMO - ${Date.now().toString().slice(-8)} `
            : `ORD - ${Date.now().toString().slice(-8)} `;
        setOrderNumber(orderNum);

        setLoading(true); // Trigger global loader before redirect

        if (demoMode) {
            // ✅ DEMO MODE: Always succeed for client presentations
            clearCart();
            router.push("/checkout/status/success");
            return;
        }

        // ✅ NORMAL MODE: Random outcomes (for testing)
        const random = Math.random();

        if (random > 0.8) {
            // 20% failure
            router.push("/checkout/status/failure");
        } else if (random > 0.6) {
            // 20% pending
            router.push("/checkout/status/pending");
        } else {
            // 60% success
            clearCart();
            router.push("/checkout/status/success");
        }
    };

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-3 sm:px-6 md:px-8 lg:px-10">
                <div className="py-8 sm:py-10 md:py-12">
                    {/* Progress Indicator */}
                    <CheckoutProgress currentStep={2} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 sm:mb-5 uppercase tracking-wide text-center sm:text-left">Payment Method</h1>

                        <div className="space-y-3 sm:space-y-5">
                            {/* Payment Methods */}
                            <div className="p-3 sm:p-5 md:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10">
                                <h2 className="text-white text-xs sm:text-sm md:text-base font-light mb-2.5 sm:mb-4 uppercase tracking-wide">Select Payment Method</h2>

                                <div className="space-y-2.5">
                                    {/* Card Payment */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setPaymentMethod("card")}
                                        className={`w - full p - 3.5 sm: p - 4 rounded - xl border - 2 transition - all flex items - center gap - 2.5 sm: gap - 3 min - h - [56px] sm: min - h - [60px] ${paymentMethod === "card"
                                                ? "border-white bg-white/10 shadow-lg"
                                                : "border-white/10 hover:border-white/30"
                                            } `}
                                    >
                                        <FiCreditCard className="text-white text-lg sm:text-xl flex-shrink-0" />
                                        <span className="text-white text-sm sm:text-base font-medium">Credit/Debit Card</span>
                                        {paymentMethod === "card" && (
                                            <div className="ml-auto w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black"></div>
                                            </div>
                                        )}
                                    </motion.button>

                                    {/* UPI Payment */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setPaymentMethod("upi")}
                                        className={`w - full p - 3.5 sm: p - 4 rounded - xl border - 2 transition - all flex items - center gap - 2.5 sm: gap - 3 min - h - [56px] sm: min - h - [60px] ${paymentMethod === "upi"
                                                ? "border-white bg-white/10 shadow-lg"
                                                : "border-white/10 hover:border-white/30"
                                            } `}
                                    >
                                        <span className="text-white text-lg sm:text-xl flex-shrink-0">💳</span>
                                        <span className="text-white text-sm sm:text-base font-medium">UPI</span>
                                        {paymentMethod === "upi" && (
                                            <div className="ml-auto w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black"></div>
                                            </div>
                                        )}
                                    </motion.button>

                                    {/* Cash on Delivery */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`w - full p - 3.5 sm: p - 4 rounded - xl border - 2 transition - all flex items - center gap - 2.5 sm: gap - 3 min - h - [56px] sm: min - h - [60px] ${paymentMethod === "cod"
                                                ? "border-white bg-white/10 shadow-lg"
                                                : "border-white/10 hover:border-white/30"
                                            } `}
                                    >
                                        <FiTruck className="text-white text-lg sm:text-xl flex-shrink-0" />
                                        <span className="text-white text-sm sm:text-base font-medium">Cash on Delivery</span>
                                        {paymentMethod === "cod" && (
                                            <div className="ml-auto w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black"></div>
                                            </div>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Shipping Info Summary */}
                            <div className="p-3 sm:p-5 md:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10">
                                <h3 className="text-white text-sm sm:text-base font-light mb-2.5 sm:mb-3 uppercase tracking-wide">Shipping To</h3>
                                <div className="text-white/70 text-[11px] sm:text-xs space-y-0.5 sm:space-y-1">
                                    <p className="text-white font-medium text-xs sm:text-sm">{shippingData.fullName}</p>
                                    <p>{shippingData.address}</p>
                                    <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                                    <p>{shippingData.country}</p>
                                    <p className="pt-2 border-t border-white/10 mt-2">{shippingData.email}</p>
                                    <p>{shippingData.phone}</p>
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => {
                                                setLoading(true);
                                                router.push("/checkout/shipping");
                                            }}
                                            className="text-white/40 hover:text-white text-xs uppercase tracking-wider transition-colors"
                                        >
                                            Back to Shipping
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="p-3 sm:p-5 md:p-7 rounded-lg sm:rounded-xl luxury-glass border border-white/10">
                                <h3 className="text-white text-sm sm:text-base font-light mb-2.5 sm:mb-3">Order Total</h3>
                                <p className="text-white text-xl sm:text-2xl md:text-3xl font-light">₹{totalPrice.toFixed(2)}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => {
                                        setLoading(true);
                                        router.push("/checkout/shipping");
                                    }}
                                    disabled={isProcessing}
                                    className="py-3.5 sm:py-4 border-2 border-white/20 text-white rounded-full text-sm sm:text-base uppercase tracking-wider hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[52px] order-2 xs:order-1"
                                >
                                    Back
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="py-3.5 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base uppercase tracking-wider font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[52px] order-1 xs:order-2"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            <span className="hidden xs:inline">Processing...</span>
                                            <span className="xs:hidden">Wait...</span>
                                        </span>
                                    ) : (
                                        "Place Order"
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
