'use client';

import React from 'react';

export interface InlineErrorProps {
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    icon?: React.ReactNode;
    role?: 'alert' | 'status';
    className?: string;
}

/**
 * InlineError - Canonical error component
 * 
 * Design Principles:
 * - Inline only (no toasts, no alerts, no modals)
 * - Context-owned (rendered by the component that failed)
 * - Recoverable (always supports retry when meaningful)
 * - Calm tone (no panic UX)
 * - Accessible by default
 * 
 * Enforcement Rule:
 * Any user-visible error MUST be rendered via <InlineError />.
 * No exceptions.
 */
export function InlineError({
    title,
    message,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    icon,
    role = 'status',
    className = '',
}: InlineErrorProps) {
    return (
        <div
            role={role}
            aria-live={role === 'alert' ? 'assertive' : 'polite'}
            className={`rounded-lg border border-white/10 bg-white/5 p-4 text-sm ${className}`}
        >
            <div className="flex items-start gap-3">
                {icon && <div className="mt-0.5 text-white/60">{icon}</div>}

                <div className="flex-1">
                    <p className="font-medium text-white">{title}</p>

                    {message && (
                        <p className="mt-1 text-white/60">
                            {message}
                        </p>
                    )}

                    {(actionLabel || secondaryActionLabel) && (
                        <div className="mt-3 flex gap-3">
                            {actionLabel && onAction && (
                                <button
                                    onClick={onAction}
                                    className="text-sm font-medium text-white hover:underline"
                                >
                                    {actionLabel}
                                </button>
                            )}

                            {secondaryActionLabel && onSecondaryAction && (
                                <button
                                    onClick={onSecondaryAction}
                                    className="text-sm text-white/60 hover:underline"
                                >
                                    {secondaryActionLabel}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
