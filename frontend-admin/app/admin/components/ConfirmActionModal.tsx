'use client';

import { adminTheme } from '../config/theme';

/**
 * Confirm Action Modal
 * Phase 8: Confirmation dialog for destructive actions
 * CORRECTED: Uses existing HumanTee tokens
 */

interface ConfirmActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    isDangerous?: boolean;
}

export function ConfirmActionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    isDangerous = false,
}: ConfirmActionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
            <div className={`${adminTheme.surface} p-4 md:p-6 rounded max-w-md w-full ${adminTheme.border} border`}>
                <h2 className={`text-lg md:text-xl font-bold ${adminTheme.textPrimary} mb-3 md:mb-4`}>
                    {title}
                </h2>
                <p className={`${adminTheme.textMuted} text-sm md:text-base mb-4 md:mb-6`}>
                    {message}
                </p>
                <div className="flex gap-2 md:gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className={`${adminTheme.button.secondary} text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${isDangerous ? adminTheme.button.danger : adminTheme.button.primary} text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
