"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/contexts/LoadingContext";

interface ShippingData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface DeliveryInfoProps {
    shippingData: ShippingData;
}

export default function DeliveryInfo({ shippingData }: DeliveryInfoProps) {
    const router = useRouter();
    const { setLoading } = useLoading();

    return (
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
    );
}
