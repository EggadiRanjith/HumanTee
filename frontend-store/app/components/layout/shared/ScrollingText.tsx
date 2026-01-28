"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/app/contexts/SettingsContext";

export default function ScrollingText() {
    // Fetch footer banner settings from header-footer section
    const { settings, loading: isLoading } = useSettings();
    const headerFooter = settings?.['header-footer'];

    // Import fallback settings
    const fallbackSettings = require('@/config/fallback-settings.json');

    // Get footer banner messages - use DB first, fallback if missing
    const messages = settings?.banner_messages?.messages
        || fallbackSettings['header-footer']?.banner_messages?.messages
        || [];



    // Loading skeleton
    if (isLoading) {
        return (
            <div className="relative w-full overflow-hidden bg-brand-bg py-12 sm:py-16 lg:py-20">
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 60,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={i}
                                className="
                                    mx-6 sm:mx-8
                                    h-[18vw] sm:h-[14vw] md:h-[11vw] lg:h-[9vw] xl:h-[8vw]
                                    w-[80vw] sm:w-[70vw] md:w-[60vw]
                                    rounded-lg
                                    relative overflow-hidden
                                "
                                style={{
                                    backgroundImage:
                                        "linear-gradient(120deg, \
                                            rgba(168, 255, 206, 0.1), \
                                            rgba(93, 240, 255, 0.15), \
                                            rgba(52, 199, 247, 0.1), \
                                            rgba(142, 255, 224, 0.15), \
                                            rgba(168, 255, 206, 0.1) \
                                        )",
                                    backgroundSize: "350% 350%",
                                }}
                            >
                                <div
                                    className="absolute inset-0 animate-[shimmer_3s_infinite]"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(120deg, \
                                                transparent, \
                                                rgba(168, 255, 206, 0.3), \
                                                rgba(93, 240, 255, 0.4), \
                                                rgba(142, 255, 224, 0.3), \
                                                transparent \
                                            )",
                                        backgroundSize: "200% 100%",
                                        transform: "translateX(-100%)",
                                    }}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    }

    // If no messages, don't render
    if (!messages || messages.length === 0) return null;

    // Join messages with separator
    const scrollText = messages.join(' · ');

    return (
        <div className="relative w-full overflow-hidden bg-brand-bg py-12 sm:py-16 lg:py-20">
            <div className="absolute inset-0 flex items-center overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 90,
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
                                    {scrollText}
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* AQUA-GREEN FLOW ANIMATION */}
            <style>{`
                @keyframes aquaFlow {
                    0%   { background-position: 0% 50%;   }
                    40%  { background-position: 80% 60%;  }
                    60%  { background-position: 100% 50%; }
                    80%  { background-position: 40% 40%;  }
                    100% { background-position: 0% 50%;   }
                }

                .animate-aquaFlow {
                    animation: aquaFlow 6.2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
