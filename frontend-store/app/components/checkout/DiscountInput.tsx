'use client';

import { useState } from 'react';
import { FiTag, FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import type { AppliedDiscount } from '@/app/types/discount.types';

interface DiscountInputProps {
    cartTotal: number;
    appliedDiscount: AppliedDiscount | null;
    onApply: (code: string) => Promise<void>;
    onRemove: () => void;
}

export default function DiscountInput({
    cartTotal,
    appliedDiscount,
    onApply,
    onRemove
}: DiscountInputProps) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApply = async () => {
        if (!code.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            await onApply(code.toUpperCase());
            setCode(''); // Clear input on success
        } catch (err: any) {
            setError(err.message || 'Invalid discount code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    // If discount is applied, show success banner
    if (appliedDiscount) {
        return (
            <div className="p-4 rounded-xl luxury-glass border border-green-500/30 bg-green-500/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <FiCheck className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">
                                Discount Applied: {appliedDiscount.code}
                            </p>
                            <p className="text-green-400 text-xs mt-0.5">
                                You're saving ₹{appliedDiscount.discountAmount.toFixed(2)}! 🎉
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onRemove}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    >
                        <FiX className="w-4 h-4" />
                        Remove
                    </button>
                </div>
            </div>
        );
    }

    // Default input state
    return (
        <div className="space-y-3">
            <div className="p-4 rounded-xl luxury-glass border border-white/10 bg-white/5">
                <label className="block text-white/70 text-xs uppercase tracking-[0.18em] mb-3">
                    Have a discount code?
                </label>

                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter code"
                            disabled={isLoading}
                            className="
                w-full px-4 py-2.5 rounded-lg
                bg-white/5 border border-white/10
                text-white placeholder:text-white/40
                focus:outline-none focus:ring-2 focus:ring-white/20
                disabled:opacity-50 disabled:cursor-not-allowed
                font-mono uppercase text-sm
              "
                            maxLength={20}
                        />
                        <FiTag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={isLoading || !code.trim()}
                        className="
              px-6 py-2.5 rounded-lg
              bg-white/10 border border-white/20
              text-white text-sm font-medium
              hover:bg-white/15 hover:border-white/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
              flex items-center gap-2
            "
                    >
                        {isLoading ? (
                            <>
                                <FiLoader className="w-4 h-4 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            'Apply'
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 text-sm font-medium">Invalid Code</p>
                        <p className="text-red-300/70 text-xs mt-0.5">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
