import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Warns users about unsaved changes before leaving the page
 * Prevents accidental data loss
 */
export function useUnsavedChanges(isDirty: boolean, message?: string) {
    const router = useRouter();

    const defaultMessage = message || 'You have unsaved changes. Are you sure you want to leave?';

    // Warn on browser close/refresh
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = defaultMessage;
                return defaultMessage;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty, defaultMessage]);

    // Note: Next.js 13+ App Router doesn't have router events
    // For route change warnings, use a custom solution or middleware
    // This is a known limitation of the App Router
}

/**
 * Hook version that returns a confirmation function
 * Use this for manual confirmation before navigation
 */
export function useConfirmUnsaved(isDirty: boolean) {
    const confirmNavigation = useCallback(() => {
        if (!isDirty) return true;

        return window.confirm(
            'You have unsaved changes. Are you sure you want to leave?'
        );
    }, [isDirty]);

    return { confirmNavigation, isDirty };
}
