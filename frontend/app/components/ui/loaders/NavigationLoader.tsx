"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLoading } from "../../context/LoadingContext";


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

function NavigationLoaderContent() {
    const { isLoading, setLoading } = useLoading();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams, setLoading]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href && !link.target && !link.download) {
                const url = new URL(link.href);
                const current = new URL(window.location.href);

                if (url.origin === current.origin && url.pathname !== current.pathname) {
                    setLoading(true);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [setLoading]);

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

            {/* Adaptive text */}
            <motion.p
                className="
                    mt-8 
                    text-[3.5vw] sm:text-[2.5vw] lg:text-[1.2vw]
                    max-text-base
                    text-white/70 uppercase tracking-[0.14em] font-light
                "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Loading
            </motion.p>
        </div>
    );
}

export default function NavigationLoader() {
    return (
        <Suspense fallback={null}>
            <NavigationLoaderContent />
        </Suspense>
    );
}
