/**
 * Style constants
 * Common style values and configuration
 */

export const STOCK_THRESHOLDS = {
    LOW: 3,
    LIMITED: 8,
} as const;

export const BADGE_STYLES = {
    sale: 'bg-red-500 text-white shadow-red-500/40',
    bestseller: 'bg-amber-300 text-black shadow-amber-300/50',
    new: 'bg-emerald-400 text-black shadow-emerald-400/40',
} as const;

export const BADGE_LABELS = {
    sale: 'SALE',
    bestseller: 'BESTSELLER',
    new: 'NEW',
} as const;
