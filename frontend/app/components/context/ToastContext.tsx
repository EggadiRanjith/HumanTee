/**
 * Toast Notification System
 * User-friendly feedback for cart actions and errors
 */

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, title: string, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: ToastType, title: string, message: string, duration = 5000) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { id, type, title, message, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-md">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const bgColors = {
        success: "from-green-500/20 to-emerald-500/20 border-green-500/30",
        error: "from-red-500/20 to-rose-500/20 border-red-500/30",
        warning: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
        info: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    };

    const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    };

    return (
        <div
            className={`bg-gradient-to-r ${bgColors[toast.type]} border backdrop-blur-xl rounded-lg p-4 shadow-lg animate-slide-in-right`}
        >
            <div className="flex items-start gap-3">
                <div className="text-2xl">{icons[toast.type]}</div>
                <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{toast.title}</h4>
                    <p className="text-sm text-white/70">{toast.message}</p>
                </div>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                    ✕
                </button>
            </div>
        </div>
    );
}
