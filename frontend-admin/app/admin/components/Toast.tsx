/**
 * Toast Notification Component
 * Professional replacement for browser alerts
 */

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = 'error', onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const colors = {
        error: 'bg-red-500',
        success: 'bg-green-500',
        warning: 'bg-orange-500',
        info: 'bg-blue-500',
    };

    const icons = {
        error: '❌',
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[9999] ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl min-w-[320px] max-w-md`}
        >
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icons[type]}</span>
                <p className="flex-1 font-medium text-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Close notification"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
}

// Toast Container Component
interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type?: 'error' | 'success' | 'warning' | 'info' }>;
    removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <AnimatePresence>
            {toasts.map((toast, index) => (
                <div key={toast.id} style={{ top: `${80 + index * 80}px` }} className="fixed left-1/2 -translate-x-1/2 z-[9999]">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </AnimatePresence>
    );
}
