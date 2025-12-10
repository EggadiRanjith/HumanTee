"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Link from "next/link";
import emptyAnimation from "@/public/animation/lottie/empty.json";

interface ActionButton {
    label: string;
    href: string;
}

interface EmptyStateProps {
    title: string;
    description: string;
    animationData: any; // Lottie JSON data
    primary?: ActionButton;
    secondary?: ActionButton;
}

export default function EmptyState({
    title,
    description,
    animationData,
    primary,
    secondary,
}: EmptyStateProps) {
    return (
        <div className="
            min-h-[calc(100vh-var(--header-height)-6rem)] 
            flex flex-col items-center justify-center text-center 
            px-4 sm:px-6 md:px-8 lg:px-10
            py-8 sm:py-12 md:py-16 lg:py-20
        ">

            {/* LOTTIE ANIMATION - Responsive sizing */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-6 sm:mb-8 md:mb-10"
            >
                <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    className="
                        w-[120px] h-[120px]
                        xs:w-[140px] xs:h-[140px]
                        sm:w-[160px] sm:h-[160px]
                        md:w-[180px] md:h-[180px]
                        lg:w-[200px] lg:h-[200px]
                        mx-auto
                    "
                />
            </motion.div>

            {/* TITLE - Fully responsive typography */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="
                    text-brand-primary font-light tracking-wide
                    text-2xl
                    xs:text-[26px]
                    sm:text-3xl
                    md:text-4xl
                    lg:text-[42px]
                    xl:text-5xl
                    mb-2 sm:mb-3 md:mb-4
                    px-4
                "
            >
                {title}
            </motion.h1>

            {/* DESCRIPTION - Adaptive width and sizing */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="
                    text-brand-text-muted leading-relaxed
                    text-sm
                    xs:text-[15px]
                    sm:text-base
                    md:text-lg
                    lg:text-xl
                    max-w-[280px]
                    xs:max-w-[320px]
                    sm:max-w-md
                    md:max-w-lg
                    lg:max-w-xl
                    mb-8 sm:mb-10 md:mb-12
                    px-4
                "
            >
                {description}
            </motion.p>

            {/* ACTION BUTTONS - Mobile-first responsive layout */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="
                    flex flex-col sm:flex-row 
                    gap-3 sm:gap-4 md:gap-5
                    justify-center items-center
                    w-full 
                    max-w-[300px] sm:max-w-fit
                "
            >
                {primary && (
                    <Link
                        href={primary.href}
                        className="
                            w-full sm:w-auto
                            px-8 sm:px-10 md:px-12 lg:px-14
                            py-3.5 sm:py-4 md:py-4
                            rounded-full
                            bg-white text-black
                            text-xs sm:text-sm md:text-base
                            tracking-wide font-semibold
                            shadow-lg shadow-white/20
                            transition-opacity duration-200
                            hover:opacity-90
                            text-center
                            touch-manipulation
                            whitespace-nowrap
                            inline-flex items-center justify-center
                        "
                    >
                        {primary.label}
                    </Link>
                )}

                {secondary && (
                    <Link
                        href={secondary.href}
                        className="
                            w-full sm:w-auto
                            px-8 sm:px-10 md:px-12 lg:px-14
                            py-3.5 sm:py-4 md:py-4
                            rounded-full
                            border-2 border-white/30
                            bg-white/5 backdrop-blur-sm
                            text-white
                            text-xs sm:text-sm md:text-base
                            tracking-wide font-medium
                            transition-all duration-200
                            hover:bg-white/10 hover:border-white/40
                            text-center
                            touch-manipulation
                            whitespace-nowrap
                            inline-flex items-center justify-center
                        "
                    >
                        {secondary.label}
                    </Link>
                )}
            </motion.div>
        </div>
    );
}

/* ------------------------------------------------
   PRESETS USING CLASSIC PROFESSIONAL LOTTIE FILES
------------------------------------------------ */

export function EmptyCart() {
    return (
        <EmptyState
            title="Your Cart is Empty"
            description="Add premium items to your cart to begin your experience."
            animationData={emptyAnimation}
            primary={{ label: "Continue Shopping", href: "/shop" }}
            secondary={{ label: "View Collections", href: "/shop" }}
        />
    );
}

export function EmptyWishlist() {
    return (
        <EmptyState
            title="Wishlist is Empty"
            description="Save items you love and revisit them anytime."
            animationData={emptyAnimation}
            primary={{ label: "Browse Products", href: "/shop" }}
        />
    );
}

export function EmptyOrders() {
    return (
        <EmptyState
            title="No Orders Yet"
            description="Your order history will appear here after your first purchase."
            animationData={emptyAnimation}
            primary={{ label: "Start Shopping", href: "/shop" }}
        />
    );
}

export function EmptySearch() {
    return (
        <EmptyState
            title="No Results Found"
            description="Try adjusting your search or explore our curated collections."
            animationData={emptyAnimation}
            primary={{ label: "Clear Search", href: "/shop" }}
            secondary={{ label: "Browse All Products", href: "/shop" }}
        />
    );
}

export function EmptyNotifications() {
    return (
        <EmptyState
            title="You're All Caught Up"
            description="New notifications will appear here when available."
            animationData={emptyAnimation}
            primary={{ label: "Continue Browsing", href: "/shop" }}
        />
    );
}
