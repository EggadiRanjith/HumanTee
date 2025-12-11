"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/context/CartContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    const router = useRouter();
    const { items } = useCart();
    const { setLoading } = useLoading();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Redirect to shipping page ONCE on mount only
        if (items.length > 0 && !hasRedirected.current) {
            hasRedirected.current = true;
            setLoading(true);
            router.push("/checkout/shipping");
        }
        // Only run on mount, not on items change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pt-[calc(var(--header-height)+3rem)] flex items-center justify-center">
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
                            onClick={() => {
                                setLoading(true);
                                router.push("/shop");
                            }}
                            className="px-8 py-3 bg-white text-black rounded-full text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // NavigationLoader will handle the transition
    return null;
}
