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
import { PaymentSkeleton } from "./_components/PaymentSkeleton";

export default function PaymentPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const {
        items,
        paymentMethod,
        setPaymentMethod,
        shippingData,
        isProcessing,
        handlePlaceOrder,
        appliedDiscount,
        discountedTotal,
    } = usePaymentFlow();

    // Optional redirect to login has been removed for guest checkout support

    // Check if shipping data is complete
    const hasShippingData = shippingData.fullName && shippingData.email && shippingData.address;

    if (!hasShippingData) {
        router.push("/checkout/shipping");
        return null;
    }

    // Show skeleton during auth loading
    if (authLoading) {
        return <PaymentSkeleton />;
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-8 sm:pb-16">
            <GradientOverlay variant="violet" />

            <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="py-6 sm:py-8 md:py-10">
                    <CheckoutProgress currentStep={2} />

                    <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-5 sm:mb-6 md:mb-8 text-center sm:text-left">
                        Payment Method
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {/* Left Column - Payment Selection & Delivery Info */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
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
                            <OrderSummaryCheckout
                                items={items}
                                pincode={shippingData.postalCode}
                                appliedDiscount={appliedDiscount}
                                discountedTotal={discountedTotal}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
