/**
 * Shop Filter Chips Component
 * Displays active filters as removable chips
 */

"use client";

import { ShopFilters } from '../hooks';

interface ShopFilterChipsProps {
    filters: ShopFilters;
    onRemoveFilter: (key: keyof ShopFilters) => void;
    onClearAll: () => void;
}

export function ShopFilterChips({ filters, onRemoveFilter, onClearAll }: ShopFilterChipsProps) {
    const activeFilters = Object.entries(filters).filter(
        ([key, value]) => value && key !== 'page'
    ) as [keyof ShopFilters, string][];

    if (activeFilters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-white/60 uppercase tracking-wider">Active Filters:</span>

            {activeFilters.map(([key, value]) => (
                <button
                    key={key}
                    onClick={() => onRemoveFilter(key)}
                    aria-label={`Remove ${key} filter: ${value}`}
                    className="
                        px-3 py-1.5 
                        bg-white/10 hover:bg-white/15
                        border border-white/20
                        rounded-full 
                        text-xs text-white
                        flex items-center gap-2
                        transition-all duration-200
                        group
                    "
                >
                    <span className="capitalize">{key}: {value}</span>
                    <span className="text-white/60 group-hover:text-white transition-colors" aria-hidden="true">×</span>
                </button>
            ))}

            <button
                onClick={onClearAll}
                aria-label="Clear all active filters"
                className="
                    text-xs text-white/60 hover:text-white
                    underline underline-offset-2
                    transition-colors
                "
            >
                Clear All
            </button>
        </div>
    );
}
