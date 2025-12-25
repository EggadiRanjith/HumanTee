/**
 * Shared Layout Design Tokens
 * Consistent transitions, focus states, and animations across Header & Footer
 */

// Transition Timings (Material Design)
export const TRANSITIONS = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    medium: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.25, 0.8, 0.25, 1)',
} as const;

// Easing Curves
export const EASING = {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)', // Slow down at end
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)', // Speed up at end
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)', // Sharp transition
    smooth: 'cubic-bezier(0.25, 0.8, 0.25, 1)', // Apple-style smooth
} as const;

// Focus Ring Styles (WCAG 2.1 AA compliant)
export const FOCUS_RING = {
    // Default focus ring
    default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',

    // Subtle focus ring (for buttons)
    subtle: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',

    // Inset focus ring (for inputs)
    inset: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40',

    // Glow focus (for icons)
    glow: 'focus-visible:outline-none focus-visible:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]',
} as const;

// Hover Effects
export const HOVER = {
    // Scale up
    scale: 'hover:scale-105 active:scale-95',
    scaleSubtle: 'hover:scale-102 active:scale-98',

    // Glow
    glow: 'hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]',
    glowStrong: 'hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]',

    // Opacity
    fadeIn: 'hover:opacity-100',
    fadeOut: 'hover:opacity-80',
} as const;

// Micro-animations
export const MICRO_ANIMATIONS = {
    // Fade in on mount
    fadeIn: {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },

    // Slide in from bottom
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] },
    },

    // Scale in
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },
} as const;

// Spring Physics (for Framer Motion)
export const SPRING = {
    // Bouncy spring
    bouncy: {
        type: 'spring' as const,
        stiffness: 500,
        damping: 25,
    },

    // Smooth spring
    smooth: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
    },

    // Gentle spring
    gentle: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
    },
} as const;

// Z-Index Scale
export const Z_INDEX = {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
} as const;
