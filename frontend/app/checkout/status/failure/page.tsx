"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { FiX, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import failureAnimation from "@/public/animation/lottie/order-status/order_falure.json";

export default function FailurePage() {
    const router = useRouter();
    const { orderNumber } = useCheckout();
    const [showSplash, setShowSplash] = useState(true);

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
                                animationData={failureAnimation}
                                loop={false}
                                autoplay
                                className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]"
                            />
                        </motion.div>

                        {/* Failure Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-center px-6"
                        >
                            <h1 className="text-red-400 text-2xl sm:text-3xl md:text-4xl font-light mb-3 uppercase tracking-wide">
                                Payment Failed
                            </h1>
                            <p className="text-white/60 text-sm sm:text-base">
                                We couldn't process your payment...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Failure Page Content */}
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
                            <div className="p-5 sm:p-7 md:p-9 rounded-xl sm:rounded-2xl luxury-glass border border-red-400/20 bg-red-500/10">
                                {/* Error Icon with Animation */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                    className="w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-5"
                                >
                                    <motion.div
                                        animate={{
                                            rotate: [0, -10, 10, -10, 0]
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.5
                                        }}
                                    >
                                        <FiX className="text-red-400 text-2xl sm:text-3xl md:text-4xl" strokeWidth={3} />
                                    </motion.div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-red-400 text-lg sm:text-xl md:text-2xl font-light mb-2 sm:mb-3 uppercase tracking-wide px-3"
                                >
                                    Payment Failed
                                </motion.h1>

                                {orderNumber && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <p className="text-white/60 mb-1 text-[9px] sm:text-[10px] uppercase tracking-wider">Reference</p>
                                        <p className="text-white text-sm sm:text-base font-light mb-3 sm:mb-5">{orderNumber}</p>
                                    </motion.div>
                                )}

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-white/80 mb-5 sm:mb-7 leading-relaxed text-xs sm:text-sm md:text-base px-3"
                                >
                                    We couldn't process your payment. This could be due to insufficient funds,
                                    incorrect payment details, or a technical issue. Please try again.
                                </motion.p>

                                {/* Common Reasons Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="p-3 sm:p-5 rounded-lg sm:rounded-xl bg-white/5 border border-red-400/20 mb-5 sm:mb-7 text-left"
                                >
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                        <FiAlertCircle className="text-red-400 text-sm sm:text-base flex-shrink-0" />
                                        <h3 className="text-white text-[10px] sm:text-xs uppercase tracking-wider">Common Issues</h3>
                                    </div>
                                    <ul className="text-white/70 text-[11px] sm:text-xs space-y-1.5">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                                            <span>Insufficient funds in your account</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                                            <span>Incorrect card details or expired card</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                                            <span>Payment gateway timeout or technical issue</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                                            <span>Transaction declined by your bank</span>
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
                                        onClick={() => router.push("/checkout/payment")}
                                        className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-black rounded-full text-[10px] sm:text-xs uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[44px] sm:min-h-[48px] font-medium"
                                    >
                                        Try Again
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => router.push("/cart")}
                                        className="px-5 sm:px-7 py-3 sm:py-3.5 border-2 border-white/20 text-white rounded-full text-[10px] sm:text-xs uppercase tracking-wider hover:bg-white/5 transition-colors min-h-[44px] sm:min-h-[48px]"
                                    >
                                        Back to Cart
                                    </motion.button>
                                </motion.div>

                                {/* Support Section */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-5 sm:mt-7 pt-3 sm:pt-5 border-t border-white/10"
                                >
                                    <p className="text-white/50 text-[9px] sm:text-[10px] mb-1.5">
                                        Still having trouble? Our support team is here to help
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-[9px] sm:text-[10px]">
                                        <a
                                            href="mailto:humanteeofficial@gmail.com"
                                            className="text-white/70 hover:text-white transition-colors break-all"
                                        >
                                            humanteeofficial@gmail.com
                                        </a>
                                        <span className="hidden sm:inline text-white/30">|</span>
                                        <a
                                            href="tel:+917780661493"
                                            className="text-white/70 hover:text-white transition-colors"
                                        >
                                            +91 7780-661493
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
