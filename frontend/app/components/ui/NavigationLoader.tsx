"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const TShirtIcon = () => (
    <svg
        viewBox="0 0 100 100"
        className="w-[14vw] h-[14vw] 
                   sm:w-[10vw] sm:h-[10vw] 
                   lg:w-[6vw] lg:h-[6vw]
                   max-w-16 max-h-16
                   text-white"
        fill="currentColor"
    >
        <path d="M30 15 L20 20 L5 35 L15 45 L25 35 L25 85 L75 85 L75 35 L85 45 L95 35 L80 20 L70 15 L60 25 C55 30 45 30 40 25 Z" />
    </svg>
);

export default function NavigationLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href && !link.target && !link.download) {
                const url = new URL(link.href);
                const current = new URL(window.location.href);

                if (url.origin === current.origin && url.pathname !== current.pathname) {
                    setIsLoading(true);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-dusk)]/95 backdrop-blur-xl">

            <div className="relative">

                {/* Adaptive circle size */}
                <div
                    className="
                        w-[26vw] h-[26vw]
                        sm:w-[18vw] sm:h-[18vw]
                        lg:w-[10vw] lg:h-[10vw]
                        max-w-32 max-h-32
                        rounded-full border-2 border-white/20 border-t-white animate-spin
                    "
                />

                {/* Flip Animation */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <TShirtIcon />
                </motion.div>
            </div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="
                    mt-10 text-white/80 
                    text-xs sm:text-sm lg:text-base 
                    uppercase tracking-[0.3em] font-light
                "
            >
                Loading
            </motion.p>

        </div>
    );
}
