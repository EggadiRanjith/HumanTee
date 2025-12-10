"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    const router = useRouter();
    const { items } = useCart();

    useEffect(() => {
        // Redirect to shipping page as the entry point
        if (items.length > 0) {
            router.push("/checkout/shipping");
        }
    }, [items, router]);

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="p-8 rounded-2xl luxury-glass border border-white/10 max-w-md mx-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                            <span className="text-white/40 text-2xl">🛒</span>
                        </div>
                        <h2 className="text-white text-2xl font-light mb-2 uppercase tracking-wide">Your Cart is Empty</h2>
                        <p className="text-white/60 text-sm mb-6">Add some premium pieces to get started with your order</p>
                        <button
                            onClick={() => router.push("/shop")}
                            className="px-8 py-3 bg-white text-black rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Show loading state while redirecting
    return (
        <div className="min-h-screen brand-bg pt-[var(--header-height)] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60 text-sm">Loading checkout...</p>
            </div>
        </div>
    );
}
