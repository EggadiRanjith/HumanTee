"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface LoaderProps {
    duration?: number;
    children?: ReactNode;
    onComplete?: () => void;
}

export default function Loader({
    duration = 3500,
    children,
    onComplete,
}: LoaderProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <div className="relative min-h-[100svh] bg-black">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        key="lux-loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden 
                                   bg-gradient-to-br from-[#050505] via-[#0c0f25] via-[#221135] to-[#050505]"
                    >
                        {/* Atmospheric moving light fields */}
                        <motion.div
                            className="absolute inset-0 opacity-35"
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at top, rgba(255,255,255,0.35), transparent 50%), radial-gradient(circle at bottom, rgba(255,255,255,0.12), transparent 45%)",
                                backgroundSize: "200% 200%",
                            }}
                        />

                        {/* Soft glow blobs */}
                        <motion.div
                            className="absolute -top-16 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[120px]"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-[120px]"
                            animate={{ scale: [1.1, 0.9, 1.1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* MAIN CONTENT SEQUENCE */}
                        <div className="relative flex flex-col items-center gap-6 text-center text-white px-4">

                            {/* 1. TOP LABEL — Reveal Mask */}
                            <motion.span
                                className="text-[0.6rem] uppercase tracking-[0.7em] text-white/70 sm:text-[0.7rem]"
                                style={{ fontFamily: "'Geist', sans-serif" }}
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                animate={{ clipPath: "inset(0 0% 0 0)" }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.2,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                            >
                                Maison Digitale
                            </motion.span>

                            {/* 2. HUMANTEE — Hero Mask Reveal */}
                            <motion.h1
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                                           font-light bg-clip-text text-transparent 
                                           bg-gradient-to-r from-white via-white to-white/60"
                                style={{ fontFamily: "'Geist', sans-serif" }}
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                animate={{ clipPath: "inset(0 0% 0 0)" }}
                                transition={{
                                    duration: 1.6,
                                    delay: 0.55,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                            >
                                HUMANTEE
                            </motion.h1>

                            {/* 3. DIVIDER LINE — Cinematic Grow */}
                            <motion.div
                                className="h-px w-48 sm:w-64 bg-gradient-to-r from-transparent via-white/60 to-transparent mt-3"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                    duration: 1.1,
                                    delay: 0.9,
                                    ease: "easeOut",
                                }}
                            />

                            {/* 4. SUBTEXT — Elegant Fade-Up */}
                            <motion.p
                                className="text-[0.6rem] uppercase tracking-[0.45em] text-white/75 sm:text-[0.7rem]"
                                style={{ fontFamily: "'Geist', sans-serif" }}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 1.25,
                                    ease: "easeOut",
                                }}
                            >
                                crafted experiences
                            </motion.p>
                        </div>

                        {/* Bottom ambient line */}
                        <motion.div
                            className="absolute inset-x-0 bottom-16 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.9 }}
                        >
                            <motion.div
                                className="h-px w-52 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                animate={{ scaleX: [0.4, 1, 0.4] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fade-in of the page content */}
            <div
                className={`transition-opacity duration-700 ${
                    isVisible ? "opacity-0" : "opacity-100"
                }`}
            >
                {children}
            </div>
        </div>
    );
}
