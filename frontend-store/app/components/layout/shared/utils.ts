/**
 * Shared Layout Utilities
 * Helper functions for consistent styling
 */

import { TRANSITIONS, FOCUS_RING, HOVER } from './design-tokens';

/**
 * Combine transition classes
 */
export function transition(...properties: string[]): string {
    return `transition-[${properties.join(',')}] duration-200 ease-out`;
}

/**
 * Get focus ring class
 */
export function focusRing(variant: keyof typeof FOCUS_RING = 'default'): string {
    return FOCUS_RING[variant];
}

/**
 * Get hover effect class
 */
export function hoverEffect(...effects: (keyof typeof HOVER)[]): string {
    return effects.map(effect => HOVER[effect]).join(' ');
}

/**
 * Combine interactive classes (hover + focus + transition)
 */
export function interactive(options?: {
    hover?: (keyof typeof HOVER)[];
    focus?: keyof typeof FOCUS_RING;
    transition?: string[];
}): string {
    const classes: string[] = [];

    if (options?.hover) {
        classes.push(hoverEffect(...options.hover));
    }

    if (options?.focus) {
        classes.push(focusRing(options.focus));
    }

    if (options?.transition) {
        classes.push(transition(...options.transition));
    } else {
        classes.push('transition-all duration-200');
    }

    return classes.join(' ');
}
