"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon?: ReactNode;
    emoji?: string;
    title: string;
    description: string;
    primaryAction?: {
        label: string;
        href: string;
    };
    secondaryAction?: {
        label: string;
        href: string;
    };
    className?: string;
}

export default function EmptyState({
    icon,
    emoji = "📦",
    title,
    description,
    primaryAction,
    secondaryAction,
    className = ""
}: EmptyStateProps) {
    return (
        <div className={`flex items-center justify-center min-h-[60vh] py-12 px-4 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md w-full"
            >
                <div className="p-8 sm:p-10 md:p-12 rounded-2xl luxury-glass border border-white/10">
                    {/* Icon/Emoji */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="mb-6"
                    >
                        {icon ? (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                {icon}
                            </div>
                        ) : (
                            <div className="text-6xl sm:text-7xl md:text-8xl opacity-40">
                                {emoji}
                            </div>
                        )}
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-white text-xl sm:text-2xl md:text-3xl font-light mb-3 uppercase tracking-wide"
                    >
                        {title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/60 text-sm sm:text-base mb-8 leading-relaxed"
                    >
                        {description}
                    </motion.p>

                    {/* Actions */}
                    {(primaryAction || secondaryAction) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                        >
                            {primaryAction && (
                                <Link
                                    href={primaryAction.href}
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-white/90 transition-colors min-h-[48px] sm:min-h-[52px] font-medium flex items-center justify-center"
                                >
                                    {primaryAction.label}
                                </Link>
                            )}
                            {secondaryAction && (
                                <Link
                                    href={secondaryAction.href}
                                    className="px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/20 text-white rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-white/5 transition-colors min-h-[48px] sm:min-h-[52px] flex items-center justify-center"
                                >
                                    {secondaryAction.label}
                                </Link>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Preset empty state components for common use cases
export function EmptyCart() {
    return (
        <EmptyState
            emoji="🛒"
            title="Your Cart is Empty"
            description="Add some premium pieces to get started with your order"
            primaryAction={{
                label: "Continue Shopping",
                href: "/shop"
            }}
            secondaryAction={{
                label: "View Collections",
                href: "/shop"
            }}
        />
    );
}

export function EmptyOrders() {
    return (
        <EmptyState
            emoji="📦"
            title="No Orders Yet"
            description="You haven't placed any orders yet. Start shopping to see your order history here."
            primaryAction={{
                label: "Start Shopping",
                href: "/shop"
            }}
        />
    );
}

export function EmptyWishlist() {
    return (
        <EmptyState
            emoji="❤️"
            title="Your Wishlist is Empty"
            description="Save your favorite items here for later. Start browsing to add items to your wishlist."
            primaryAction={{
                label: "Browse Products",
                href: "/shop"
            }}
        />
    );
}

export function EmptySearch() {
    return (
        <EmptyState
            emoji="🔍"
            title="No Results Found"
            description="We couldn't find any products matching your search. Try different keywords or browse our collections."
            primaryAction={{
                label: "Clear Search",
                href: "/shop"
            }}
            secondaryAction={{
                label: "View All Products",
                href: "/shop"
            }}
        />
    );
}

export function EmptyNotifications() {
    return (
        <EmptyState
            emoji="🔔"
            title="No Notifications"
            description="You're all caught up! Check back later for updates on your orders and account."
            primaryAction={{
                label: "Continue Shopping",
                href: "/shop"
            }}
        />
    );
}
