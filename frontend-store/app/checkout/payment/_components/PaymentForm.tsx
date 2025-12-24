"use client";

import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiCheck } from "react-icons/fi";
import type { PaymentMethod } from "@/app/contexts/CheckoutContext";

interface PaymentMethodOption {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
}

interface PaymentFormProps {
    paymentMethod: PaymentMethod | null;
    onPaymentMethodChange: (method: PaymentMethod) => void;
}

// Phase 1.2: React.memo for render optimization
export default memo(function PaymentForm({
    paymentMethod,
    onPaymentMethodChange,
}: PaymentFormProps) {
    // Render measurement
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.count('PaymentForm render');
        }
    });
    const paymentOptions: PaymentMethodOption[] = [
        {
            id: "razorpay",
            icon: <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: "Razorpay",
            description: "Credit Card, Debit Card, UPI, Net Banking"
        }
    ];

    return (
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
                        onClick={() => onPaymentMethodChange(option.id as PaymentMethod)}
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
    );
});
