"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
    onComplete?: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => setIsExiting(true), 2800);
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, 3500);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(hideTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={
                        isExiting
                            ? { opacity: 0 }               // Fade only → clean
                            : { opacity: 1 }
                    }
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="
                        fixed inset-0 z-[100]
                        flex items-center justify-center
                        bg-white overflow-hidden
                    "
                >
                    {/* Hide effects while exiting */}
                    {!isExiting && (
                        <>
                            {/* Shockwave 1 */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 4, opacity: [0, 0.3, 0] }}
                                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                                className="absolute w-64 h-64 rounded-full"
                                style={{
                                    background: "radial-gradient(circle, rgba(20,49,20,0.4) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
                                    boxShadow: "0 0 60px 30px rgba(0,0,0,0.15)",
                                }}
                            />

                            {/* Shockwave 2 */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 3.5, opacity: [0, 0.2, 0] }}
                                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                className="absolute w-48 h-48 rounded-full border border-black/20"
                            />

                            {/* Shockwave 3 */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 3, opacity: [0, 0.15, 0] }}
                                transition={{ duration: 0.9, delay: 1, ease: "easeOut" }}
                                className="absolute w-32 h-32 rounded-full border border-black/10"
                            />

                            {/* Ambient Glow */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="absolute w-96 h-96 rounded-full"
                                style={{
                                    background: "radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 60%)",
                                }}
                            />
                        </>
                    )}

                    {/* Text container is always shown */}
                    <div className="relative flex flex-col items-center gap-4 z-10">

                        {/* Animated Gradient Text */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="
                                text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-[0.2em]
                                bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 to-yellow-500
                                bg-clip-text text-transparent animate-gradientMove
                            "
                            style={{
                                backgroundSize: "300% 300%",
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 700,
                                letterSpacing: "0.15em",
                            }}
                        >
                            HUMANTEE
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                            className="
                                text-sm md:text-base uppercase text-black/80 
                                tracking-[0.4em] animate-pulseText
                            "
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 300,
                            }}
                        >
                            Begin Your Style
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
