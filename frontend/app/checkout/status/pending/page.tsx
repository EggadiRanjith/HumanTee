"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import pendingAnimation from "@/public/animation/lottie/order-status/Pending_order.json";

export default function PendingPage() {
    const router = useRouter();
    const { orderNumber, shippingData } = useCheckout();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // If no order number, redirect to checkout
        if (!orderNumber) {
            router.push("/checkout");
        }
    }, [orderNumber, router]);

    useEffect(() => {
        // Hide splash screen after 3 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Lock scroll when splash is visible
        if (showSplash) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showSplash]);

    if (!orderNumber) {
        return null;
    }

    return (
        <>
            {/* Splash Screen with Lottie Animation */}
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center brand-bg"
                    >
                        {/* Lottie Animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mb-6"
                        >
                            <Lottie
                                animationData={pendingAnimation}
                                loop={true}
                                autoplay
                                className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]"
                            />
                        </motion.div>

                        {/* Pending Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-center px-6"
                        >
                            <h1 className="text-amber-400 text-2xl sm:text-3xl md:text-4xl font-light mb-3 uppercase tracking-wide">
                                Payment Processing
                            </h1>
                            <p className="text-white/60 text-sm sm:text-base">
                                Please wait while we verify your payment...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Pending Page Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showSplash ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen brand-bg pt-[var(--header-height)] pb-12 sm:pb-20"
            >
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                    <div className="py-6 sm:py-10 md:py-12 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="p-5 sm:p-7 md:p-9 rounded-xl sm:rounded-2xl luxury-glass border border-amber-400/20 bg-amber-500/10">
                                {/* Pending Icon with Pulse Animation */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                    className="w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-5"
                                >
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 10, 0],
                                            scale: [1, 1.1, 1.1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    >
                                        <FiClock className="text-amber-400 text-2xl sm:text-3xl md:text-4xl" strokeWidth={2.5} />
                                    </motion.div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-amber-400 text-lg sm:text-xl md:text-2xl font-light mb-2 sm:mb-3 uppercase tracking-wide px-3"
                                >
                                    Payment Processing
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className="text-white/60 mb-1 text-[9px] sm:text-[10px] uppercase tracking-wider">Order Number</p>
                                    <p className="text-white text-base sm:text-lg md:text-xl font-light mb-3 sm:mb-5">{orderNumber}</p>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-white/80 mb-5 sm:mb-7 leading-relaxed text-xs sm:text-sm md:text-base px-3"
                                >
                                    Your payment is being processed. This may take a few minutes.
                                    We'll send you a confirmation email at{" "}
                                    <span className="text-white font-medium break-all">{shippingData.email}</span>
                                    {" "}once it's confirmed.
                                </motion.p>

                                {/* Status Info Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white/5 border border-amber-400/20 mb-5 sm:mb-7"
                                >
                                    <h3 className="text-amber-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2 text-center sm:text-left">What's Happening?</h3>
                                    <ul className="text-white/70 text-[11px] sm:text-xs space-y-1.5 text-left">
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                                            <span>Your order has been received and is being verified</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                                            <span>Payment confirmation is in progress with your bank</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-400 mt-1 flex-shrink-0">•</span>
                                            <span>You'll receive an update within 10-15 minutes</span>
                                        </li>
                                    </ul>
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
                                        className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-black rounded-full text-[10px] sm:text-xs uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[44px] sm:min-h-[48px] font-medium"
                                    >
                                        Check Order Status
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => router.push("/shop")}
                                        className="px-5 sm:px-7 py-3 sm:py-3.5 border-2 border-white/20 text-white rounded-full text-[10px] sm:text-xs uppercase tracking-wider hover:bg-white/5 transition-colors min-h-[44px] sm:min-h-[48px]"
                                    >
                                        Continue Shopping
                                    </motion.button>
                                </motion.div>

                                {/* Additional Info */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-5 sm:mt-7 pt-3 sm:pt-5 border-t border-white/10"
                                >
                                    <p className="text-white/50 text-[9px] sm:text-[10px] mb-1.5">
                                        Need help? Contact our support team
                                    </p>
                                    <a
                                        href="mailto:humanteeofficial@gmail.com"
                                        className="text-amber-400 text-[10px] sm:text-xs hover:text-amber-300 transition-colors break-all"
                                    >
                                        humanteeofficial@gmail.com
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
