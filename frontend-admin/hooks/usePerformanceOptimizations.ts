import { useCallback, useRef } from 'react';

/**
 * Intersection Observer hook for infinite scroll
 * Triggers callback when element comes into view
 * 
 * @example
 * const observerRef = useIntersectionObserver(() => {
 *   fetchNextPage();
 * });
 * 
 * return <div ref={observerRef} />
 */
export function useIntersectionObserver(
    callback: () => void,
    options: IntersectionObserverInit = {}
) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const elementRef = useCallback((node: HTMLElement | null) => {
        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        if (node) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        callback();
                    }
                },
                {
                    threshold: 0.1,
                    ...options,
                }
            );

            observerRef.current.observe(node);
        }
    }, [callback, options]);

    return elementRef;
}

/**
 * Prefetch hook for hover interactions
 * Prefetches data when user hovers over an element
 */
export function usePrefetch<T>(
    queryKey: any[],
    queryFn: () => Promise<T>,
    enabled: boolean = true
) {
    const prefetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const handleMouseEnter = useCallback(() => {
        if (!enabled) return;

        // Delay prefetch slightly to avoid unnecessary requests
        prefetchTimeoutRef.current = setTimeout(() => {
            queryFn();
        }, 100);
    }, [queryFn, enabled]);

    const handleMouseLeave = useCallback(() => {
        if (prefetchTimeoutRef.current) {
            clearTimeout(prefetchTimeoutRef.current);
        }
    }, []);

    return {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };
}
