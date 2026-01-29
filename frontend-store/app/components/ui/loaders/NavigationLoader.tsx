"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLoading } from "@/app/contexts/LoadingContext";
import * as Sentry from "@sentry/nextjs";
import { trackWebVitals } from "@/lib/monitoring/performance";
import { useIsSafari } from "@/app/lib/useIsSafari";

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

    // Timeout error state
    const [hasTimedOut, setHasTimedOut] = useState(false);

    // Reduced motion detection
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const isSafari = useIsSafari();

    // Focus management
    const loaderRef = useRef<HTMLDivElement>(null);
    const previousFocus = useRef<HTMLElement | null>(null);

    // Track previous pathname for autonomous navigation detection
    const previousPathnameRef = useRef<string>(pathname);
    const loadStartTimeRef = useRef<number>(0);

    // AUTONOMOUS NAVIGATION DETECTION
    // Show loader when pathname changes, hide after minimum display time
    useEffect(() => {
        const currentPath = pathname + (searchParams?.toString() || '');
        const previousPath = previousPathnameRef.current;

        // Navigation detected: pathname changed
        if (currentPath !== previousPath) {
            previousPathnameRef.current = currentPath;

            // Show loader and record start time
            setLoading(true);
            loadStartTimeRef.current = Date.now();

            // Scroll to top immediately
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            // BULLETPROOF: Force hide after 700ms, no exceptions
            const MIN_DISPLAY = 700;
            const hideTimer = setTimeout(() => {
                setLoading(false);
            }, MIN_DISPLAY);

            // Also add a safety timeout to force hide if something goes wrong
            const safetyTimer = setTimeout(() => {
                setLoading(false);
            }, MIN_DISPLAY + 100);

            return () => {
                clearTimeout(hideTimer);
                clearTimeout(safetyTimer);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]); // Removed setLoading from deps to prevent race condition

    // Error timeout (independent of navigation)
    useEffect(() => {
        if (isLoading) {
            setHasTimedOut(false);

            const timeout = setTimeout(() => {
                setHasTimedOut(true);

                Sentry.captureMessage('Navigation timeout', {
                    level: 'warning',
                    extra: {
                        pathname,
                        duration: 30000,
                        timestamp: Date.now()
                    }
                });
            }, 30000); // Increased from 10s to 30s for slow API responses

            return () => clearTimeout(timeout);
        }
    }, [isLoading, pathname]);

    // ARIA busy state + prevent scrolling
    useEffect(() => {
        if (isLoading) {
            document.body.setAttribute('aria-busy', 'true');
            // Prevent scrolling while loading
            document.body.style.overflow = 'hidden';
        } else {
            document.body.removeAttribute('aria-busy');
            // Restore scrolling
            document.body.style.overflow = '';
        }

        return () => {
            document.body.removeAttribute('aria-busy');
            document.body.style.overflow = '';
        };
    }, [isLoading]);

    // Critical Fix #2: Focus containment
    useEffect(() => {
        if (isLoading && loaderRef.current) {
            // Save current focus
            previousFocus.current = document.activeElement as HTMLElement;

            // Focus loader container
            loaderRef.current.focus();

            // Trap focus
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    e.preventDefault(); // Prevent tabbing out
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);

                // Restore focus
                if (previousFocus.current) {
                    previousFocus.current.focus();
                }
            };
        }
    }, [isLoading]);

    // Critical Fix #3: Detect reduced motion preference
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Critical Fix #4: Track Web Vitals (independent of loader state)
    useEffect(() => {
        trackWebVitals(pathname);
    }, [pathname]);

    const simpleAnimation = prefersReducedMotion || isSafari;

    // Critical Fix #1: Timeout error UI - Luxury redesign
    if (hasTimedOut) {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0f0520] ${simpleAnimation ? "" : "backdrop-blur-2xl"}`}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative max-w-md mx-4"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 blur-3xl rounded-3xl" />

                    {/* Modal card */}
                    <div
                        className={`relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl p-8 sm:p-10 ${simpleAnimation ? "" : "backdrop-blur-xl"} shadow-2xl`}
                    >
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-white text-xl sm:text-2xl font-light text-center mb-3 tracking-wide">
                            Connection Timeout
                        </h3>

                        {/* Description */}
                        <p className="text-white/50 text-sm text-center mb-8 leading-relaxed">
                            The page is taking longer than expected to load. Please check your connection and try again.
                        </p>

                        {/* Button */}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white text-sm uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40"
                        >
                            Reload Page
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isLoading) return null;

    return (
        <>
            {/* Critical Fix #2: Screen reader announcement */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isLoading ? 'Loading page content, please wait' : ''}
            </div>

            {/* Loader UI */}
            <div
                ref={loaderRef}
                tabIndex={-1}
                className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-dusk)]/95 ${simpleAnimation ? "" : "backdrop-blur-xl"}`}
                aria-label="Loading page"
            >
                <div className="relative">
                    {/* Spinning circle - Use Framer Motion instead of CSS animate-spin */}
                    <motion.div
                        className="
                            w-[26vw] h-[26vw]
                            sm:w-[18vw] sm:h-[18vw]
                            lg:w-[10vw] lg:h-[10vw]
                            max-w-32 max-h-32
                            rounded-full border-2 border-white/20 border-t-white
                        "
                        animate={{ rotate: 360 }}
                        transition={
                            simpleAnimation
                                ? {
                                    duration: 3, // Gentle but visible spin for reduce motion
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                                : {
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                        }
                    />

                    {/* T-shirt icon with conditional animation */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={simpleAnimation ? {} : { rotateY: [0, 180, 360] }}
                        transition={simpleAnimation ? {} : {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ transformStyle: simpleAnimation ? "flat" : "preserve-3d" }}
                    >
                        <TShirtIcon />
                    </motion.div>
                </div>

                {/* Loading text */}
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
        </>
    );
}

export default function NavigationLoader() {
    return (
        <Suspense fallback={null}>
            <NavigationLoaderContent />
        </Suspense>
    );
}
