"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/contexts/LoadingContext";

interface PaymentActionsProps {
    isProcessing: boolean;
    paymentMethod: string | null;
    onPlaceOrder: () => void;
}

export default function PaymentActions({
    isProcessing,
    paymentMethod,
    onPlaceOrder,
}: PaymentActionsProps) {
    const router = useRouter();
    const { setLoading } = useLoading();

    return (
        <>
            {/* Place Order Button - Mobile Top */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="sm:hidden mb-4"
            >
                <button
                    onClick={onPlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-white text-black rounded-full text-sm uppercase tracking-wider font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                            Processing...
                        </span>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </motion.div>

            {/* Back and Place Order Buttons - Desktop/Mobile Bottom */}
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
                    onClick={onPlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 py-3.5 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base uppercase tracking-wider font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                            Processing...
                        </span>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </motion.div>
        </>
    );
}
