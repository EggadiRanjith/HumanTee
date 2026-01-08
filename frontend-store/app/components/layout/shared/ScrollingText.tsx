"use client";

import { motion } from "framer-motion";

export default function ScrollingText() {
    return (
        <div className="relative w-full overflow-hidden bg-brand-bg py-12 sm:py-16 lg:py-20">
            <div className="absolute inset-0 flex items-center overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 70,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex">
                            {[...Array(4)].map((_, i) => (
                                <span
                                    key={`${setIndex}-${i}`}
                                    className="
                                        mx-6 sm:mx-8
                                        font-extrabold uppercase tracking-wider
                                        text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[9vw] xl:text-[8vw]
                                        animate-aquaFlow
                                    "
                                    style={{
                                        fontFamily: "var(--font-benzin)",
                                        lineHeight: "1",
                                        WebkitTextStroke: "1px rgba(255,255,255,0.18)",

                                        /** LUXURY MINT + AQUA + CYAN METALLIC */
                                        backgroundImage:
                                            "linear-gradient(120deg, \
                                                #A8FFCE, \
                                                #5DF0FF, \
                                                #34C7F7, \
                                                #8EFFE0, \
                                                #A8FFCE \
                                            )",
                                        backgroundSize: "350% 350%",
                                        backgroundPosition: "0% 50%",

                                        /** Show gradient inside text */
                                        color: "transparent",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                    }}
                                >
                                    WEAR HUMANTEE · WEAR CONFIDENCE
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* AQUA-GREEN FLOW ANIMATION */}
            <style>{`
                @keyframes aquaFlow {
                    0%   { background-position: 0% 50%;   filter: brightness(1); }
                    40%  { background-position: 80% 60%;  filter: brightness(1.28); }
                    60%  { background-position: 100% 50%; filter: brightness(1.18); }
                    80%  { background-position: 40% 40%;  filter: brightness(1.25); }
                    100% { background-position: 0% 50%;   filter: brightness(1); }
                }

                .animate-aquaFlow {
                    animation: aquaFlow 6.2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
