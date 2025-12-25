/**
 * Scroll Hint Component
 * Animated scroll indicator that fades on scroll
 */

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { memo } from "react";

function ScrollHint() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    return (
        <motion.div
            style={{ opacity }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-geist">
                Explore
            </span>
            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"
            />
        </motion.div>
    );
}

export default memo(ScrollHint);
