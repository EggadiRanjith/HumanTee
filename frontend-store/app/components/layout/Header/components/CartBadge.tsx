/**
 * Cart Badge Component
 * Animated cart item counter with accessibility
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CART_BADGE_SIZES } from "../constants";
import type { CartBadgeProps } from "../types";

export default function CartBadge({ count, variant = 'desktop' }: CartBadgeProps) {
    if (count === 0) return null;

    const sizes = variant === 'mobile' ? CART_BADGE_SIZES.mobile : CART_BADGE_SIZES.desktop;

    return (
        <AnimatePresence>
            <motion.span
                key={count}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="
          absolute -top-1 -right-1
          bg-white text-black font-bold rounded-full
          flex items-center justify-center
          shadow-[0_0_8px_rgba(255,255,255,0.4)]
          border border-black/10 z-10 px-0.5
        "
                style={{
                    minWidth: sizes.size,
                    height: sizes.size,
                    fontSize: sizes.fontSize,
                }}
                role="status"
                aria-live="polite"
            >
                {count}
            </motion.span>
        </AnimatePresence>
    );
}
