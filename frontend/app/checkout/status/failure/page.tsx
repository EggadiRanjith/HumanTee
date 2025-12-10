"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/components/context/CheckoutContext";
import { FiX, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function FailurePage() {
    const router = useRouter();
    const { orderNumber } = useCheckout();

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
                        <div className="p-6 sm:p-8 md:p-10 rounded-2xl luxury-glass border border-red-400/20 bg-red-500/10">
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
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6"
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
                                    <FiX className="text-red-400 text-3xl sm:text-4xl md:text-5xl" strokeWidth={3} />
                                </motion.div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-red-400 text-xl sm:text-2xl md:text-3xl font-light mb-3 sm:mb-4 uppercase tracking-wide px-4"
                            >
                                Payment Failed
                            </motion.h1>

                            {orderNumber && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className="text-white/60 mb-1 sm:mb-2 text-[10px] sm:text-xs uppercase tracking-wider">Reference</p>
                                    <p className="text-white text-base sm:text-lg font-light mb-4 sm:mb-6">{orderNumber}</p>
                                </motion.div>
                            )}

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/80 mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm md:text-base px-4"
                            >
                                We couldn't process your payment. This could be due to insufficient funds,
                                incorrect payment details, or a technical issue. Please try again.
                            </motion.p>

                            {/* Common Reasons Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="p-4 sm:p-6 rounded-xl bg-white/5 border border-red-400/20 mb-6 sm:mb-8 text-left"
                            >
                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                    <FiAlertCircle className="text-red-400 text-base sm:text-lg flex-shrink-0" />
                                    <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider">Common Issues</h3>
                                </div>
                                <ul className="text-white/70 text-xs sm:text-sm space-y-2">
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
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[48px] sm:min-h-[52px] font-medium"
                                >
                                    Try Again
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push("/cart")}
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/20 text-white rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-white/5 transition-colors min-h-[48px] sm:min-h-[52px]"
                                >
                                    Back to Cart
                                </motion.button>
                            </motion.div>

                            {/* Support Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10"
                            >
                                <p className="text-white/50 text-[10px] sm:text-xs mb-2">
                                    Still having trouble? Our support team is here to help
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
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
        </div>
    );
}
