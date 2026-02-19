import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends to analytics
 */

function sendToAnalytics(metric: Metric) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
    }

    // Send to analytics service (e.g., Google Analytics, Sentry)
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
        });
    }

    // Send to Sentry (if configured)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureMessage(`Web Vital: ${metric.name}`, {
            level: 'info',
            tags: {
                web_vital: metric.name,
                rating: metric.rating,
            },
            extra: {
                value: metric.value,
                id: metric.id,
                navigationType: metric.navigationType,
            },
        });
    }
}

/**
 * Initialize Web Vitals tracking
 * Call this in your root layout or _app
 */
export function initWebVitals() {
    if (typeof window === 'undefined') return;

    // Cumulative Layout Shift
    onCLS(sendToAnalytics);

    // Interaction to Next Paint (replaces FID in web-vitals v5)
    onINP(sendToAnalytics);

    // First Contentful Paint
    onFCP(sendToAnalytics);

    // Largest Contentful Paint
    onLCP(sendToAnalytics);

    // Time to First Byte
    onTTFB(sendToAnalytics);
}

/**
 * Performance thresholds
 * Based on Google's Core Web Vitals
 */
export const PERFORMANCE_THRESHOLDS = {
    LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
    INP: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint
    CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
    TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
};

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}
