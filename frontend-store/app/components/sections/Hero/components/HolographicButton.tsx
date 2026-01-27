/**
 * Holographic Button Component
 * Premium button with parallax shimmer effect
 */

"use client";

import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useCallback, memo } from "react";
import { FOCUS_RING } from "@/app/components/layout/shared/design-tokens";
import { useLoading } from "@/app/contexts/LoadingContext";

interface HolographicButtonProps {
    text: string;
    href?: string;
}

function HolographicButton({ text, href = "/shop" }: HolographicButtonProps) {
    const { setLoading } = useLoading();

    // Simulated Gyro / Mouse Parallax
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMove = useCallback(
        (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

            x.set(clientX - rect.left);
            y.set(clientY - rect.top);
        },
        [x, y]
    );

    return (
        <Link href={href} onClick={() => setLoading(true)} className="inline-block relative group">
            <motion.button
                className={`
          relative overflow-hidden
          min-h-[44px] min-w-[120px]
          px-6 xs:px-8 sm:px-10 md:px-12
          py-3.5 sm:py-3.5 md:py-4
          font-geist font-semibold
          text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] tracking-[0.20em] xs:tracking-[0.25em] uppercase
          rounded-full
          border border-white/20
          bg-white/5 backdrop-blur-xl
          text-white
          transition-all duration-500
          hover:scale-[1.03] hover:border-white/40
          active:scale-95
          ${FOCUS_RING.glow}
        `}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                whileTap={{ scale: 0.97 }}
                aria-label={`${text} - Shop now`}
            >
                {/* Ambient Holographic Sheen (Auto-Loop) */}
                <motion.div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    animate={{
                        background: [
                            "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 20%, transparent 100%)",
                            "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                            "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 80%, transparent 100%)",
                        ],
                        backgroundPosition: ["200% 0", "-200% 0"],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 2,
                    }}
                />

                {/* Interaction Glow (Follows Finger/Mouse) */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25), transparent 60%)`,
                    }}
                />

                <span className="relative z-10">{text}</span>
            </motion.button>
        </Link>
    );
}

export default memo(HolographicButton);
