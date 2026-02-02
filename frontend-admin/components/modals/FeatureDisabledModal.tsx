'use client';

import { useRouter } from 'next/navigation';
import { FiX, FiAlertCircle, FiSettings } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface FeatureDisabledModalProps {
    featureName: string;
    disabledSince?: string;
    message: string;
    settingsPath?: string;
    onClose?: () => void;
}

export function FeatureDisabledModal({
    featureName,
    disabledSince,
    message,
    settingsPath = '/admin/settings/system',
    onClose
}: FeatureDisabledModalProps) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    const handleGoToSettings = () => {
        router.push(settingsPath);
        handleClose();
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-4 md:p-6 border-b border-gray-100">
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 md:top-4 md:right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-100 rounded-xl">
                                <FiAlertCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                                    {featureName} Disabled
                                </h2>
                                {disabledSince && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Since {new Date(disabledSince).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            {message}
                        </p>

                        {settingsPath && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-xs md:text-sm text-blue-800">
                                    <strong>To enable:</strong> Go to Settings → System → {featureName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Understood
                        </button>
                        {settingsPath && (
                            <button
                                onClick={handleGoToSettings}
                                className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiSettings className="w-4 h-4" />
                                Go to Settings
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
