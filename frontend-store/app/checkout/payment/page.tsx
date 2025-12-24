"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { CheckoutProgress, OrderSummaryCheckout } from "@/app/components/ui/checkout";
import { GradientOverlay } from "@/app/components/ui/layout";
import { usePaymentFlow } from "./_hooks/usePaymentFlow";
import PaymentForm from "./_components/PaymentForm";
import DeliveryInfo from "./_components/DeliveryInfo";
import PaymentActions from "./_components/PaymentActions";

export default function PaymentPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const {
        items,
        totalPrice,
        paymentMethod,
        setPaymentMethod,
        shippingData,
        isProcessing,
        handlePlaceOrder,
    } = usePaymentFlow();

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
                        {/* Left Column - Payment Selection & Delivery Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payment Methods - CRITICAL RENDER */}
                            <PaymentForm
                                paymentMethod={paymentMethod}
                                onPaymentMethodChange={setPaymentMethod}
                            />

                            {/* Shipping Address Summary */}
                            <DeliveryInfo shippingData={shippingData} />

                            {/* Action Buttons */}
                            <PaymentActions
                                isProcessing={isProcessing}
                                paymentMethod={paymentMethod}
                                totalPrice={totalPrice}
                                onPlaceOrder={handlePlaceOrder}
                            />
                        </div>

                        {/* Right Column - Order Summary (DEFERRED) */}
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
