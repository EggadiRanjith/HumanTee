import { useCallback, useRef } from 'react';

/**
 * Debounce Hook
 * Delays function execution until after wait time has elapsed
 * Useful for search inputs, auto-save, etc.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}

/**
 * Throttle Hook
 * Limits function execution to once per wait time
 * Useful for scroll handlers, resize handlers, etc.
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const lastRun = useRef(Date.now());
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();

            if (now - lastRun.current >= delay) {
                callback(...args);
                lastRun.current = now;
            } else {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    callback(...args);
                    lastRun.current = Date.now();
                }, delay - (now - lastRun.current));
            }
        },
        [callback, delay]
    );
}
