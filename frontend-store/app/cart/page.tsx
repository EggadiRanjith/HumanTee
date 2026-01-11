/**
 * Cart Page
 * FANG-Level Refactored with mobile-first responsive design
 * Modular architecture with performance optimizations
 */

"use client";

import { useRouter } from "next/navigation";
import { logError } from '@/lib/logger';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/app/contexts/LoadingContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { CartItem, CartSummary } from "@/app/components/ui/cart";
import { GradientOverlay } from "@/app/components/ui/layout";
import { EmptyCart } from "@/app/components/ui/EmptyState";
import { CartHeader, CartSkeleton, DiscountSection } from "./components";
import { useCartOperations } from "./hooks";
import type { LottieAnimation } from "./types";

// Dynamic import to prevent SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CartPage() {
    const router = useRouter();
    const { setLoading } = useLoading();
    const { isAuthenticated } = useAuth();

    // Cart operations hook (memoized)
    const {
        items,
        hasItems,
        cartSummary,
        suggestions,
        isLoadingSuggestions,
        appliedDiscount,
        handleRemoveItem,
        handleUpdateQuantity,
        handleApplyDiscount,
        handleRemoveDiscount,
    } = useCartOperations();

    // Local state
    const [showIntro, setShowIntro] = useState(true);
    const [introAnimation, setIntroAnimation] = useState<LottieAnimation | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);

    // Load Lottie Animation
    useEffect(() => {
        fetch('/animation/lottie/shopping/cart_opening.json')
            .then(res => res.json())
            .then(data => setIntroAnimation(data))
            .catch(err => {
                logError(err, "Failed to load Cart Intro");
                setShowIntro(false); // Skip intro on error
            });
    }, []);

    const handleCheckout = () => {
        setLoading(true);

        if (!isAuthenticated) {
            // Redirect to login with return URL
            router.push('/login?redirect=/checkout');
        } else {
            router.push("/checkout");
        }
    };

    // Intro Animation View - Overlay on top of content
    const showOverlay = showIntro && introAnimation;

    // Empty cart state
    if (!hasItems) {
        return (
            <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
                <GradientOverlay variant="violet" />
                {/* Mobile: 16px padding, Tablet: 24px, Desktop: 40px */}
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)] relative">
            <GradientOverlay variant="violet" />

            {/* Intro Overlay - Mobile only */}
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

            {/* Main Content - Mobile-first responsive */}
            <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-10 pt-6 sm:pt-8 lg:pt-12">

                {/* Header Component */}
                <CartHeader totalItems={cartSummary.itemCount} />

                {/* Grid Layout - Mobile: 1 col, Desktop: 3 cols (2+1) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8">

                    {/* Cart Items Section - Mobile: Full width, Desktop: 2/3 width */}
                    <div className="lg:col-span-2">
                        {/* Section Container */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4 lg:p-6">
                            {/* Section Header */}
                            <h2 className="text-white text-sm sm:text-base font-medium mb-3 sm:mb-4 lg:mb-6">
                                Cart Items ({items.length})
                            </h2>
                            {/* Items List */}
                            <div className="space-y-3 sm:space-y-4">
                                {items.map((item, index) => (
                                    <CartItem
                                        key={`${item.id}-${item.size}`}
                                        item={item}
                                        index={index}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section - Mobile: Full width, Desktop: 1/3 width, Sticky */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-5 lg:sticky lg:top-24 lg:self-start">
                        {/* Discount Section Container */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4 lg:p-5">
                            <h2 className="text-white text-sm sm:text-base font-medium mb-3 sm:mb-4">
                                Discounts
                            </h2>
                            <DiscountSection
                                suggestions={suggestions}
                                appliedDiscount={appliedDiscount}
                                isLoadingSuggestions={isLoadingSuggestions}
                                showManualEntry={showManualEntry}
                                cartTotal={cartSummary.subtotal}
                                onApply={handleApplyDiscount}
                                onRemove={handleRemoveDiscount}
                                onOpenManualEntry={() => setShowManualEntry(true)}
                                onCloseManualEntry={() => setShowManualEntry(false)}
                            />
                        </div>

                        {/* Cart Summary Container */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4 lg:p-5">
                            <h2 className="text-white text-sm sm:text-base font-medium mb-3 sm:mb-4">
                                Order Summary
                            </h2>
                            <CartSummary
                                subtotal={cartSummary.subtotal}
                                totalItems={cartSummary.itemCount}
                                onCheckout={handleCheckout}
                                discount={appliedDiscount}
                                total={cartSummary.total}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
