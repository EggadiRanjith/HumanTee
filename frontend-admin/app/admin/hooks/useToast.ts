/**
 * useToast Hook
 * Simple hook for showing toast notifications
 */

'use client';

import { useState, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'error' | 'success' | 'warning' | 'info' = 'error') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return { toasts, showToast, removeToast };
}
