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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${adminTheme.surface} p-6 rounded max-w-md ${adminTheme.border} border`}>
                <h2 className={`text-xl font-bold ${adminTheme.textPrimary} mb-4`}>
                    {title}
                </h2>
                <p className={`${adminTheme.textMuted} mb-6`}>
                    {message}
                </p>
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className={adminTheme.button.secondary}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={isDangerous ? adminTheme.button.danger : adminTheme.button.primary}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
