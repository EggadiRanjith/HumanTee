"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SuccessPage() {
    const router = useRouter();
    const { orderNumber, shippingData } = useCheckout();

    useEffect(() => {
        // If no order number, redirect to checkout
        if (!orderNumber) {
            router.push("/checkout");
        }
    }, [orderNumber, router]);

    if (!orderNumber) {
        return null;
    }

    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] pb-20 sm:pb-24">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10">
                <div className="py-8 sm:py-12 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="p-6 sm:p-8 md:p-10 rounded-2xl luxury-glass border border-green-400/20 bg-green-500/10">
                            {/* Success Icon with Animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.2
                                }}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6"
                            >
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <FiCheck className="text-green-400 text-3xl sm:text-4xl md:text-5xl" strokeWidth={3} />
                                </motion.div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-green-400 text-xl sm:text-2xl md:text-3xl font-light mb-3 sm:mb-4 uppercase tracking-wide px-4"
                            >
                                Order Placed Successfully!
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-white/60 mb-1 sm:mb-2 text-[10px] sm:text-xs uppercase tracking-wider">Order Number</p>
                                <p className="text-white text-lg sm:text-xl md:text-2xl font-light mb-4 sm:mb-6">{orderNumber}</p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/80 mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm md:text-base px-4"
                            >
                                Thank you for your purchase! We've sent a confirmation email to{" "}
                                <span className="text-white font-medium break-all">{shippingData.email}</span>.
                                Your order will be shipped to the address provided.
                            </motion.p>

                            {/* Order Details Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 mb-6 sm:mb-8 text-left"
                            >
                                <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">Shipping Address</h3>
                                <div className="text-white/70 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                                    <p className="text-white font-medium">{shippingData.fullName}</p>
                                    <p className="break-words">{shippingData.address}</p>
                                    <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                                    <p>{shippingData.country}</p>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push("/orders")}
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/20 text-white rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-white/5 transition-colors min-h-[48px] sm:min-h-[52px]"
                                >
                                    View Orders
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push("/shop")}
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[48px] sm:min-h-[52px] font-medium"
                                >
                                    Continue Shopping
                                </motion.button>
                            </motion.div>

                            {/* Additional Info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10"
                            >
                                <p className="text-white/50 text-[10px] sm:text-xs px-4">
                                    You will receive tracking information once your order ships.
                                    Expected delivery: 5-7 business days.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
