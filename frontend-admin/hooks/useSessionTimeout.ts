import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from '@/lib/toast';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const WARNING_DURATION = 5 * 60 * 1000; // 5 minutes before timeout

/**
 * Session Timeout Hook
 * Automatically logs out inactive users after 30 minutes
 * Shows warning 5 minutes before timeout
 */
export function useSessionTimeout() {
    const { logout, isAuthenticated } = useAuth();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const warningRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const warningShownRef = useRef<boolean>(false);

    const resetTimeout = useCallback(() => {
        // Clear existing timers
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningRef.current) clearTimeout(warningRef.current);
        warningShownRef.current = false;

        if (!isAuthenticated) return;

        // Show warning 5 minutes before timeout
        warningRef.current = setTimeout(() => {
            if (warningShownRef.current) return;
            warningShownRef.current = true;

            const extend = window.confirm(
                'Your session will expire in 5 minutes due to inactivity. Do you want to continue working?'
            );

            if (extend) {
                toast.success('Session extended');
                resetTimeout();
            }
        }, TIMEOUT_DURATION - WARNING_DURATION);

        // Logout after timeout
        timeoutRef.current = setTimeout(() => {
            toast.error('Session expired due to inactivity');
            logout();
        }, TIMEOUT_DURATION);
    }, [isAuthenticated, logout]);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Start timeout on mount
        resetTimeout();

        // Reset timeout on user activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            document.addEventListener(event, resetTimeout, { passive: true });
        });

        return () => {
            // Cleanup
            events.forEach(event => {
                document.removeEventListener(event, resetTimeout);
            });

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (warningRef.current) clearTimeout(warningRef.current);
        };
    }, [isAuthenticated, resetTimeout]);
}
