/**
 * Global Upload Progress Modal
 * Shows upload progress for all images when saving product
 * Blocks interaction until uploads complete
 */

"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UploadItem {
    id: string;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

interface UploadProgressModalProps {
    isOpen: boolean;
    items: UploadItem[];
    onComplete?: () => void;
}

export function UploadProgressModal({ isOpen, items, onComplete }: UploadProgressModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);

    // Calculate overall progress
    const totalProgress = items.length > 0
        ? items.reduce((sum, item) => sum + item.progress, 0) / items.length
        : 0;

    const uploadedCount = items.filter(i => i.status === 'success').length;
    const failedCount = items.filter(i => i.status === 'error').length;
    const allComplete = uploadedCount + failedCount === items.length && items.length > 0;

    // When all uploads complete successfully, show success message briefly
    useEffect(() => {
        if (allComplete && failedCount === 0) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                onComplete?.();
            }, 1000); // Show success for 1 second before closing
            return () => clearTimeout(timer);
        }
    }, [allComplete, failedCount, onComplete]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                style={{ touchAction: 'none' }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {showSuccess ? 'Upload Complete!' : 'Uploading Images'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {showSuccess
                                ? `Successfully uploaded ${uploadedCount} ${uploadedCount === 1 ? 'image' : 'images'}`
                                : `${uploadedCount} of ${items.length} uploaded`
                            }
                        </p>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${totalProgress}%` }}
                                transition={{ duration: 0.3 }}
                                className={`h-full rounded-full ${failedCount > 0 ? 'bg-red-500' :
                                        showSuccess ? 'bg-green-500' :
                                            'bg-black'
                                    }`}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                            {Math.round(totalProgress)}%
                        </p>
                    </div>

                    {/* Individual Items */}
                    <div className="px-6 pb-6 max-h-64 overflow-y-auto space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {item.status === 'success' && (
                                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    {item.status === 'error' && (
                                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    )}
                                    {item.status === 'uploading' && (
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    )}
                                    {item.status === 'pending' && (
                                        <div className="w-5 h-5 rounded-full bg-gray-300" />
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.fileName}
                                    </p>
                                    {item.error && (
                                        <p className="text-xs text-red-600 truncate">{item.error}</p>
                                    )}
                                    {item.status === 'uploading' && (
                                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                            <div
                                                className="h-1 bg-black rounded-full transition-all duration-300"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Progress Text */}
                                {item.status === 'uploading' && (
                                    <span className="text-xs text-gray-600 font-medium">
                                        {item.progress}%
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Warning if errors */}
                    {failedCount > 0 && (
                        <div className="px-6 pb-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800">
                                    {failedCount} {failedCount === 1 ? 'upload' : 'uploads'} failed. Please try again.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
