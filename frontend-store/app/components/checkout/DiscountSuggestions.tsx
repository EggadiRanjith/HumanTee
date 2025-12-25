'use client';

import { useState } from 'react';
import { logError } from '@/lib/logger';
import { FiTag, FiX, FiCheck, FiClock } from 'react-icons/fi';
import type { AppliedDiscount } from '@/app/types/discount.types';
import type { DiscountSuggestion } from '@/lib/api/discounts';

interface DiscountSuggestionsProps {
    suggestions: DiscountSuggestion[];
    appliedDiscount: AppliedDiscount | null;
    onApply: (code: string) => Promise<void>;
    onRemove: () => void;
    onManualEntry: () => void;
}

export default function DiscountSuggestions({
    suggestions,
    appliedDiscount,
    onApply,
    onRemove,
    onManualEntry
}: DiscountSuggestionsProps) {
    const [isApplying, setIsApplying] = useState<string | null>(null);

    const bestSuggestion = suggestions.find(s => s.isBest);
    const alternatives = suggestions.filter(s => !s.isBest).slice(0, 2);

    const handleApply = async (code: string) => {
        setIsApplying(code);
        try {
            await onApply(code);
        } catch (error) {
            logError(error, 'Failed to apply discount');
        } finally {
            setIsApplying(null);
        }
    };

    const getDaysRemaining = (expiresAt: string | null) => {
        if (!expiresAt) return null;
        const now = new Date();
        const expiry = new Date(expiresAt);
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    // If no suggestions, show manual entry only
    if (suggestions.length === 0) {
        return (
            <div className="p-4 rounded-xl luxury-glass border border-white/10 bg-white/5">
                <button
                    onClick={onManualEntry}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                    <FiTag className="w-4 h-4" />
                    <span className="text-sm">Have a discount code?</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Best Discount - Auto Applied or Available */}
            {bestSuggestion && (
                <div className="p-4 rounded-xl luxury-glass border border-white/10 bg-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white/70 text-xs uppercase tracking-[0.18em] mb-1">
                                💡 Best for You
                            </h3>
                            <p className="text-white text-base sm:text-lg font-medium tracking-wide break-words">
                                {bestSuggestion.code}
                            </p>
                            <p className="text-white/60 text-xs mt-0.5 truncate">
                                {bestSuggestion.name}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {appliedDiscount?.code === bestSuggestion.code ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <FiCheck className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 text-xs uppercase tracking-wide whitespace-nowrap">Applied</span>
                                    </div>
                                    <button
                                        onClick={onRemove}
                                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                        title="Remove discount"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleApply(bestSuggestion.code)}
                                    disabled={isApplying === bestSuggestion.code}
                                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/15 disabled:opacity-50 transition-all whitespace-nowrap"
                                >
                                    {isApplying === bestSuggestion.code ? 'Applying...' : 'Apply'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm gap-2">
                            <span className="text-white/60">Your Savings</span>
                            <span className="text-green-400 font-medium whitespace-nowrap">
                                ₹{bestSuggestion.savings.toFixed(2)}
                            </span>
                        </div>

                        {bestSuggestion.description && (
                            <p className="text-white/50 text-xs leading-relaxed break-words">
                                {bestSuggestion.description}
                            </p>
                        )}

                        {bestSuggestion.expiresAt && getDaysRemaining(bestSuggestion.expiresAt) !== null && (
                            <div className="flex items-center gap-1.5 text-xs text-orange-400">
                                <FiClock className="w-3 h-3 flex-shrink-0" />
                                <span>
                                    Expires in {getDaysRemaining(bestSuggestion.expiresAt)} days
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Alternative Suggestions */}
            {alternatives.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-white/60 text-xs uppercase tracking-[0.18em] px-1">
                        Other available discounts
                    </h4>

                    {alternatives.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="p-3 rounded-lg luxury-glass border border-white/10 bg-white/5"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <p className="text-white text-sm font-medium break-words">
                                            {suggestion.code}
                                        </p>
                                        {suggestion.type === 'PERCENT' && (
                                            <span className="text-xs text-white/50 whitespace-nowrap">
                                                {suggestion.value}% off
                                            </span>
                                        )}
                                        {suggestion.type === 'FLAT' && (
                                            <span className="text-xs text-white/50 whitespace-nowrap">
                                                ₹{suggestion.value} off
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                                        <span className="text-green-400 whitespace-nowrap">
                                            Save ₹{suggestion.savings.toFixed(2)}
                                        </span>
                                        {suggestion.expiresAt && getDaysRemaining(suggestion.expiresAt) !== null && (
                                            <span className="text-white/40 whitespace-nowrap">
                                                • {getDaysRemaining(suggestion.expiresAt)}d left
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 sm:self-start">
                                    {appliedDiscount?.code === suggestion.code ? (
                                        <>
                                            <div className="flex items-center gap-1 text-green-400 text-xs whitespace-nowrap">
                                                <FiCheck className="w-3 h-3" />
                                                Applied
                                            </div>
                                            <button
                                                onClick={onRemove}
                                                className="p-1.5 rounded-lg text-white/60 hover:bg-white/5 transition-all"
                                                title="Remove discount"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleApply(suggestion.code)}
                                            disabled={isApplying === suggestion.code}
                                            className="px-3 py-1.5 rounded-lg text-white/70 text-xs hover:bg-white/5 transition-all disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {isApplying === suggestion.code ? '...' : 'Switch'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Manual Entry Button */}
            <button
                onClick={onManualEntry}
                className="w-full px-4 py-2.5 rounded-lg border border-white/10 luxury-glass text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2"
            >
                <FiTag className="w-4 h-4" />
                <span className="whitespace-nowrap">Have a different code?</span>
            </button>
        </div>
    );
}
