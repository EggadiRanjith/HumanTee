"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLoading } from "@/app/contexts/LoadingContext";
import * as Sentry from "@sentry/nextjs";
import { trackWebVitals } from "@/lib/monitoring/performance";

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

    // Critical Fix #1: Decoupled error state
    const [hasTimedOut, setHasTimedOut] = useState(false);

    // Critical Fix #3: Reduced motion detection
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Critical Fix #2: Focus management
    const loaderRef = useRef<HTMLDivElement>(null);
    const previousFocus = useRef<HTMLElement | null>(null);

    // Auto-hide loader after route change
    useEffect(() => {
        let cancelled = false;

        // Scroll to top when route changes
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const hideLoader = () => {
            if (cancelled) return;

            // Wait for document to be fully loaded
            if (document.readyState === 'complete') {
                // Extra RAF cycles to ensure content is rendered
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            setLoading(false);
                            // Scroll to top again after loader hides
                            setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), 0);
                        });
                    });
                });
            } else {
                // Document not ready, check again in 100ms
                setTimeout(hideLoader, 100);
            }
        };

        // Start checking after minimum delay (prevent flash during fast navigations)
        const timer = setTimeout(hideLoader, 500);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [pathname, searchParams, setLoading]);

    // Critical Fix #1: Error timeout (decoupled from navigation state)
    useEffect(() => {
        if (isLoading) {
            setHasTimedOut(false);

            const timeout = setTimeout(() => {
                setHasTimedOut(true);

                // Log to Sentry
                Sentry.captureMessage('Navigation timeout', {
                    level: 'warning',
                    extra: {
                        pathname,
                        duration: 10000,
                        timestamp: Date.now()
                    }
                });
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [isLoading, pathname]);

    // Detect navigation clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href && !link.target && !link.download) {
                if (typeof window !== 'undefined') {
                    const url = new URL(link.href);
                    const current = new URL(window.location.href);

                    if (url.origin === current.origin && url.pathname !== current.pathname) {
                        setLoading(true);
                    }
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [setLoading]);

    // Critical Fix #2: ARIA busy state + prevent scrolling
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

    // Critical Fix #1: Timeout error UI
    if (hasTimedOut) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                <div className="text-center p-8 max-w-md">
                    <p className="text-white text-lg mb-4">
                        Page took too long to load
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
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
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-dusk)]/95 backdrop-blur-xl"
                aria-label="Loading page"
            >
                <div className="relative">
                    {/* Spinning circle */}
                    <div
                        className="
                            w-[26vw] h-[26vw]
                            sm:w-[18vw] sm:h-[18vw]
                            lg:w-[10vw] lg:h-[10vw]
                            max-w-32 max-h-32
                            rounded-full border-2 border-white/20 border-t-white animate-spin
                        "
                    />

                    {/* T-shirt icon with conditional animation */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={prefersReducedMotion ? {} : { rotateY: [0, 180, 360] }}
                        transition={prefersReducedMotion ? {} : {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ transformStyle: "preserve-3d" }}
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
