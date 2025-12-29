/**
 * Web Vitals Performance Tracking
 * Tracks real performance metrics (LCP, INP, TTFB) independent of loader state
 * Sampled at 10% to avoid Sentry noise
 */

import * as Sentry from '@sentry/nextjs';

// Sampling to avoid Sentry noise
const SAMPLE_RATE = 0.1; // 10% of sessions

/**
 * Track Web Vitals for a given page
 * Should be called on route change, NOT on loader state change
 */
export const trackWebVitals = (pathname: string) => {
    // Sample only 10% of sessions
    if (Math.random() > SAMPLE_RATE) return;

    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as any;

                const lcp = lastEntry.renderTime || lastEntry.loadTime;

                Sentry.addBreadcrumb({
                    category: 'performance',
                    message: `LCP: ${pathname}`,
                    level: 'info',
                    data: {
                        value: Math.round(lcp),
                        rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor'
                    }
                });

                lcpObserver.disconnect();
            });

            lcpObserver.observe({
                type: 'largest-contentful-paint',
                buffered: true
            });
        } catch (e) {
            // Observer not supported
        }
    }

    // INP (Interaction to Next Paint) - AGGREGATED to avoid noise
    if ('PerformanceObserver' in window) {
        try {
            let interactions: number[] = [];

            const inpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const eventEntry = entry as any;
                    // Only track slow interactions (>200ms)
                    if (eventEntry.duration > 200) {
                        interactions.push(eventEntry.duration);
                    }
                }
            });

            inpObserver.observe({
                type: 'event',
                buffered: true
            });

            // Report aggregated P75 after 30 seconds
            setTimeout(() => {
                if (interactions.length > 0) {
                    const sorted = interactions.sort((a, b) => a - b);
                    const p75 = sorted[Math.floor(sorted.length * 0.75)];

                    Sentry.addBreadcrumb({
                        category: 'performance',
                        message: `INP: ${pathname}`,
                        level: 'info',
                        data: {
                            p75: Math.round(p75),
                            count: interactions.length,
                            rating: p75 < 200 ? 'good' : p75 < 500 ? 'needs-improvement' : 'poor'
                        }
                    });
                }

                inpObserver.disconnect();
            }, 30000);
        } catch (e) {
            // Observer not supported
        }
    }

    // TTFB (Time to First Byte)
    if ('performance' in window && 'getEntriesByType' in performance) {
        try {
            const navigation = performance.getEntriesByType('navigation')[0] as any;
            if (navigation) {
                const ttfb = navigation.responseStart - navigation.requestStart;

                Sentry.addBreadcrumb({
                    category: 'performance',
                    message: `TTFB: ${pathname}`,
                    level: 'info',
                    data: {
                        value: Math.round(ttfb),
                        rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor'
                    }
                });
            }
        } catch (e) {
            // Navigation timing not supported
        }
    }
};
