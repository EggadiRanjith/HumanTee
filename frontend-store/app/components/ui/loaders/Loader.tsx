"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIsSafari } from "@/app/lib/useIsSafari";

interface LoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "spinner" | "dots" | "pulse" | "bars";
    fullScreen?: boolean;
    message?: string;
}

export default function Loader({
    size = "md",
    variant = "spinner",
    fullScreen = false,
    message
}: LoaderProps) {
    const prefersReducedMotion = useReducedMotion();
    const isSafari = useIsSafari();
    const simpleBackground = prefersReducedMotion || isSafari;
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    const dotSizes = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4",
        xl: "w-6 h-6"
    };

    const barSizes = {
        sm: "w-1 h-6",
        md: "w-1.5 h-8",
        lg: "w-2 h-12",
        xl: "w-3 h-16"
    };

    const SpinnerLoader = () => (
        <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
        </div>
    );

    const DotsLoader = () => (
        <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={`${dotSizes[size]} rounded-full bg-white`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                />
            ))}
        </div>
    );

    const PulseLoader = () => (
        <motion.div
            className={`${sizeClasses[size]} rounded-full bg-white`}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );

    const BarsLoader = () => (
        <div className="flex items-end gap-1.5">
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className={`${barSizes[size]} bg-white rounded-full`}
                    animate={{
                        scaleY: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );

    const renderLoader = () => {
        switch (variant) {
            case "dots":
                return <DotsLoader />;
            case "pulse":
                return <PulseLoader />;
            case "bars":
                return <BarsLoader />;
            case "spinner":
            default:
                return <SpinnerLoader />;
        }
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            {renderLoader()}
            {message && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/60 text-sm uppercase tracking-wider"
                >
                    {message}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-dusk)]/95 ${simpleBackground ? "" : "backdrop-blur-sm"}`}>
                {content}
            </div>
        );
    }

    return content;
}

// Additional preset loaders for common use cases
export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-dusk)]/98">
            <div className="relative">
                {/* Rotating circle border */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/20 border-t-white animate-spin" />

                {/* T-shirt icon in center */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <svg
                        viewBox="0 0 100 100"
                        className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                        fill="currentColor"
                    >
                        <path d="M30 15 L20 20 L5 35 L15 45 L25 35 L25 85 L75 85 L75 35 L85 45 L95 35 L80 20 L70 15 L60 25 C55 30 45 30 40 25 Z" />
                    </svg>
                </motion.div>
            </div>

            {/* Optional loading text */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-1/3 text-white/80 text-sm sm:text-base uppercase tracking-[0.3em] font-light"
            >
                Loading
            </motion.p>
        </div>
    );
}

export function ButtonLoader() {
    return <Loader size="sm" variant="spinner" />;
}

export function CardLoader() {
    return (
        <div className="flex items-center justify-center p-12">
            <Loader size="md" variant="dots" />
        </div>
    );
}

export function SkeletonLoader({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="h-full w-full bg-white/5 rounded-lg"></div>
        </div>
    );
}