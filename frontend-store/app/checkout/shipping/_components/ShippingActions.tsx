"use client";

import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

interface ShippingActionsProps {
    selectedAddressId: string | null;
    onContinue: () => void;
    onAddAddress: () => void;
    onBackToCart: () => void;
}

export default function ShippingActions({
    selectedAddressId,
    onContinue,
    onAddAddress,
    onBackToCart,
}: ShippingActionsProps) {
    return (
        <>
            {/* Add Address Button */}
            <button
                onClick={onAddAddress}
                className="w-full mt-4 py-3 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center gap-2 text-white/60 hover:text-white transition-all"
            >
                <FiPlus className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Add New Address</span>
            </button>

            {/* Continue Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onContinue}
                disabled={!selectedAddressId}
                className="w-full mt-4 py-3.5 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base uppercase tracking-wider font-medium hover:bg-white/90 transition-colors min-h-[48px] sm:min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue to Payment
            </motion.button>

            {/* Back to Cart */}
            <div className="mt-4 text-center">
                <button
                    onClick={onBackToCart}
                    className="text-white/40 hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                    Back to Cart
                </button>
            </div>
        </>
    );
}
