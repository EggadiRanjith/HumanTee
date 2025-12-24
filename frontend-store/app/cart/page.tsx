"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/components/context/CartContext";
import { useLoading } from "@/app/components/context/LoadingContext";
import { CartItem, CartSummary } from "@/app/components/ui/cart";
import { GradientOverlay } from "@/app/components/ui/layout";
import { EmptyCart } from "@/app/components/ui/EmptyState";
import DiscountSuggestions from "@/app/components/checkout/DiscountSuggestions";
import DiscountInput from "@/app/components/checkout/DiscountInput";
import { FiX } from "react-icons/fi";

// Dynamic import to prevent SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CartPage() {
    const router = useRouter();
    const {
        items,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
        discountedTotal,
        suggestions,
        isLoadingSuggestions
    } = useCart();
    const { setLoading } = useLoading();
    const [showIntro, setShowIntro] = useState(true);
    const [introAnimation, setIntroAnimation] = useState<any>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);

    // Load Lottie Animation
    useEffect(() => {
        fetch('/animation/lottie/shopping/cart_opening.json')
            .then(res => res.json())
            .then(data => setIntroAnimation(data))
            .catch(err => {
                console.error("Failed to load Cart Intro", err);
                setShowIntro(false); // Skip intro on error
            });
    }, []);

    const handleCheckout = () => {
        setLoading(true);
        router.push("/checkout");
    };

    // Intro Animation View - Overlay on top of content
    const showOverlay = showIntro && introAnimation;

    if (items.length === 0) {
        return (
            <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
                <GradientOverlay variant="violet" />
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)] relative">
            <GradientOverlay variant="violet" />

            {/* Intro Overlay */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center brand-bg lg:hidden"
                    >
                        <div className="w-full max-w-md p-8">
                            <Lottie
                                animationData={introAnimation}
                                loop={false}
                                autoplay={true}
                                onComplete={() => setShowIntro(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manual Discount Entry Modal */}
            <AnimatePresence>
                {showManualEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowManualEntry(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md p-6 rounded-2xl luxury-glass border border-white/20 bg-[#0d0d1a]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white text-lg font-medium">Enter Discount Code</h3>
                                <button
                                    onClick={() => setShowManualEntry(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <DiscountInput
                                cartTotal={totalPrice}
                                appliedDiscount={appliedDiscount}
                                onApply={async (code) => {
                                    await applyDiscount(code);
                                    setShowManualEntry(false);
                                }}
                                onRemove={removeDiscount}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12">

                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-[26px] sm:text-[34px] lg:text-[42px] font-light uppercase tracking-[0.14em] text-white">
                        Shopping Cart
                    </h1>
                    <p className="text-white/45 text-[11px] uppercase tracking-[0.22em] mt-2">
                        {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <CartItem
                                key={`${item.id}-${item.size}`}
                                item={item}
                                index={index}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Discount Suggestions */}
                        {!isLoadingSuggestions && (
                            <DiscountSuggestions
                                suggestions={suggestions}
                                appliedDiscount={appliedDiscount}
                                onApply={applyDiscount}
                                onRemove={removeDiscount}
                                onManualEntry={() => setShowManualEntry(true)}
                            />
                        )}

                        {/* Cart Summary */}
                        <CartSummary
                            subtotal={totalPrice}
                            totalItems={totalItems}
                            onCheckout={handleCheckout}
                            discount={appliedDiscount}
                            total={discountedTotal}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
