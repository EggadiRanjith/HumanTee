"use client";

import { motion } from "framer-motion";

export default function ScrollingText() {
    return (
        <div className="relative w-full overflow-hidden bg-brand-bg py-16 sm:py-20 lg:py-24">
            {/* Scrolling wrapper */}
            <div className="absolute inset-0 flex items-center overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 70, // Faster speed (lower number = faster)
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* Duplicate content for seamless loop */}
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {[...Array(4)].map((_, i) => (
                                <span
                                    key={`${setIndex}-${i}`}
                                    className="mx-8 uppercase tracking-wider
                    text-[120px] sm:text-[150px] lg:text-[150px]"
                                    style={{
                                        fontFamily: "var(--font-benzin)",
                                        color: "#2A78C6",
                                        WebkitTextStroke: "2px rgba(42, 120, 198, 0.35)",
                                        fontWeight: 900,
                                        lineHeight: "1",
                                    }}
                                >
                                    WEAR HUMANTEE · WEAR CONFIDENCE
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
