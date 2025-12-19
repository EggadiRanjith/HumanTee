/**
 * Admin Theme Configuration
 * Phase 8: Uses existing HumanTee design tokens
 * CORRECTED: No new colors, shares design tokens but not marketing behavior
 */

export const adminTheme = {
    // Surface colors (existing tokens)
    surface: 'bg-brand-surface',
    background: 'bg-brand-bg',
    border: 'border-white/10',

    // Text colors (existing tokens)
    textPrimary: 'text-white',
    textMuted: 'text-white/60',

    // Interactive states
    hover: 'hover:bg-white/5',
    active: 'bg-white/10',

    // Status colors (backend-driven)
    status: {
        // Product statuses
        DRAFT: 'bg-white/10 text-white/70',
        ACTIVE: 'bg-emerald-500/15 text-emerald-400',
        ARCHIVED: 'bg-red-500/15 text-red-400',

        // Order statuses
        PENDING: 'bg-yellow-500/15 text-yellow-400',
        PAID: 'bg-blue-500/15 text-blue-400',
        FULFILLED: 'bg-emerald-500/20 text-emerald-300',
        CANCELLED_MANUAL: 'bg-orange-500/20 text-orange-300',
        FAILED: 'bg-red-500/20 text-red-300',
    },

    // Action buttons
    button: {
        primary: 'bg-white text-black hover:bg-white/90 px-4 py-2 rounded font-medium transition-colors',
        secondary: 'bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded font-medium transition-colors',
        danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded font-medium transition-colors',
    },
} as const;
