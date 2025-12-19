/**
 * Quantity Selector
 * Increment/decrement quantity selector
 */

"use client";

import { FiMinus, FiPlus } from 'react-icons/fi';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
    return (
        <div className="space-y-3">
            <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                Quantity
            </p>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="p-2.5 rounded-lg border border-white/10 luxury-glass text-white/75 hover:bg-white/5 transition-colors disabled:opacity-50"
                    disabled={value <= min}
                >
                    <FiMinus className="h-4 w-4" />
                </button>

                <span className="text-white text-lg font-light min-w-[3rem] text-center">
                    {value}
                </span>

                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="p-2.5 rounded-lg border border-white/10 luxury-glass text-white/75 hover:bg-white/5 transition-colors disabled:opacity-50"
                    disabled={value >= max}
                >
                    <FiPlus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
