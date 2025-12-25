/**
 * Hero Constants
 */

export const HERO_CONSTANTS = {
    // Scroll fade distance for scroll hint
    SCROLL_FADE_DISTANCE: 200,

    // Zoom scale values
    ZOOM_SCALE: {
        EVEN: 1.05,
        ODD: 1,
    },

    // Transition durations
    TRANSITION: {
        DURATION: 1.2,
        SCALE_DURATION: 6,
        EASE: "easeInOut" as const,
    },

    // Blur values
    BLUR: {
        INITIAL: "blur(10px)",
        ACTIVE: "blur(0px)",
    },
} as const;

// Slide heading styles
export const SLIDE_STYLES = {
    heading: {
        fontFamily: "var(--font-zalando-sans)",
        fontWeight: 700,
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
    },
    cursive: {
        fontFamily: "var(--font-bonheur-royale)",
        fontWeight: 700,
    },
    tanPearl: {
        fontFamily: "var(--font-tan-pearl)",
    },
} as const;
