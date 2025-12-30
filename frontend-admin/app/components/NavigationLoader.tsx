'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Navigation Loader - Admin Panel
 * Shows T-shirt spinning animation during page transitions
 * Simplified version from store for admin panel
 */
export function NavigationLoader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    // Show loader on route change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Detect navigation clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href && !link.target && !link.download) {
                if (typeof window !== 'undefined') {
                    const url = new URL(link.href);
                    const current = new URL(window.location.href);

                    if (url.origin === current.origin && url.pathname !== current.pathname) {
                        setIsLoading(true);
                    }
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative">
                {/* Spinning circle */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/20 border-t-white animate-spin" />

                {/* T-shirt icon */}
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <svg
                        viewBox="0 0 100 100"
                        className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                        fill="currentColor"
                    >
                        <path d="M30 15 L20 20 L5 35 L15 45 L25 35 L25 85 L75 85 L75 35 L85 45 L95 35 L80 20 L70 15 L60 25 C55 30 45 30 40 25 Z" />
                    </svg>
                </div>
            </div>

            {/* Loading text */}
            <p className="mt-6 text-sm text-white/70 uppercase tracking-widest font-light">
                Loading
            </p>
        </div>
    );
}
