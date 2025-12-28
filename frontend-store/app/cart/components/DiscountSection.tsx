/**
 * Discount Section Component
 * Mobile-first discount suggestions and manual entry
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import DiscountSuggestions from '@/app/components/checkout/DiscountSuggestions';
import DiscountInput from '@/app/components/checkout/DiscountInput';
import type { AppliedDiscount } from '@/app/types/discount.types';
import type { DiscountSuggestion } from '@/lib/api/discounts';

interface DiscountSectionProps {
    suggestions: DiscountSuggestion[];
    appliedDiscount: AppliedDiscount | null;
    isLoadingSuggestions: boolean;
    showManualEntry: boolean;
    cartTotal: number;
    onApply: (code: string) => Promise<void>;
    onRemove: () => void;
    onOpenManualEntry: () => void;
    onCloseManualEntry: () => void;
}

export function DiscountSection({
    suggestions,
    appliedDiscount,
    isLoadingSuggestions,
    showManualEntry,
    cartTotal,
    onApply,
    onRemove,
    onOpenManualEntry,
    onCloseManualEntry,
}: DiscountSectionProps) {
    return (
        <>
            {/* Discount Suggestions */}
            {!isLoadingSuggestions && (
                <DiscountSuggestions
                    suggestions={suggestions}
                    appliedDiscount={appliedDiscount}
                    onApply={onApply}
                    onRemove={onRemove}
                    onManualEntry={onOpenManualEntry}
                />
            )}

            {/* Manual Entry Modal - Mobile optimized */}
            <AnimatePresence>
                {showManualEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={onCloseManualEntry}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md p-6 rounded-2xl luxury-glass border border-white/20 bg-[#0d0d1a]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white text-base sm:text-lg font-medium">
                                    Enter Discount Code
                                </h3>
                                <button
                                    onClick={onCloseManualEntry}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-target"
                                    aria-label="Close"
                                >
                                    <FiX className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            {/* Discount Input */}
                            <DiscountInput
                                cartTotal={cartTotal}
                                appliedDiscount={appliedDiscount}
                                onApply={async (code) => {
                                    await onApply(code);
                                    onCloseManualEntry();
                                }}
                                onRemove={onRemove}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
