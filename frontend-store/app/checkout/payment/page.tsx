"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useCheckout, type PaymentMethod } from "@/app/components/context/CheckoutContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { useAuth } from "@/app/context/AuthContext";
import { CheckoutProgress, OrderSummaryCheckout } from "@/app/components/ui/checkout";
import { GradientOverlay } from "@/app/components/ui/layout";
import { FiCreditCard, FiTruck, FiCheck, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PaymentPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { paymentMethod, setPaymentMethod, setOrderNumber, shippingData } = useCheckout();
    const { setLoading } = useLoading();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect to login if not authenticated
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

        // Generate order number
        const orderNum = `ORD-${Date.now().toString().slice(-8)}`;
        setOrderNumber(orderNum);

        // Clear cart and redirect to success
        clearCart();
        setLoading(true);
        router.push("/checkout/status/success");
    };

    const paymentOptions = [
        {
            id: "razorpay",
            icon: <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: "Razorpay",
            description: "Credit Card, Debit Card, UPI, Net Banking"
        }
    ];

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10">
                    <CheckoutProgress currentStep={2} />

                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-8 text-center sm:text-left">
                        Payment Method
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Payment Selection */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payment Methods */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="p-4 sm:p-6 rounded-xl luxury-glass border border-white/10"
                            >
                                <h2 className="text-white text-base sm:text-lg font-medium mb-4">
                                    Choose Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {paymentOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                                            className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === option.id
                                                ? 'border-white bg-white/10'
                                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex-shrink-0 text-white">
                                                {option.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-sm sm:text-base">
                                                    {option.label}
                                                </p>
                                                <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                                                    {option.description}
                                                </p>
                                            </div>
                                            {paymentMethod === option.id && (
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                    <FiCheck className="w-4 h-4 text-black" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Shipping Address Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="p-4 sm:p-6 rounded-xl luxury-glass border border-white/10"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-white text-base sm:text-lg font-medium">
                                        Delivery Address
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setLoading(true);
                                            router.push("/checkout/shipping");
                                        }}
                                        className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
                                    >
                                        Change
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm sm:text-base">
                                                {shippingData.fullName}
                                            </p>
                                            <p className="text-white/70 text-xs sm:text-sm mt-1">
                                                {shippingData.address}
                                            </p>
                                            <p className="text-white/70 text-xs sm:text-sm">
                                                {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                                            </p>
                                            <p className="text-white/70 text-xs sm:text-sm">
                                                {shippingData.country}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                                        <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
                                        <p className="text-white/70 text-xs sm:text-sm truncate">
                                            {shippingData.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
                                        <p className="text-white/70 text-xs sm:text-sm">
                                            {shippingData.phone}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        router.push("/checkout/shipping");
                                    }}
                                    disabled={isProcessing}
                                    className="flex-1 py-3.5 sm:py-4 border-2 border-white/20 text-white rounded-full text-sm sm:text-base uppercase tracking-wider hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || !paymentMethod}
                                    className="flex-1 py-3.5 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base uppercase tracking-wider font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            Processing...
                                        </span>
                                    ) : (
                                        `Place Order • ₹${totalPrice.toFixed(2)}`
                                    )}
                                </button>
                            </motion.div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="lg:col-span-1"
                        >
                            <OrderSummaryCheckout items={items} totalPrice={totalPrice} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
