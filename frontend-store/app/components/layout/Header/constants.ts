/**
 * Header Design Tokens & Constants
 * Single source of truth for all header styling values
 */

export const HEADER_Z_INDEX = {
    CONTAINER: 9000,
    HEADER: 9500,
    OVERLAY: 9100,
    MENU: 9200,
} as const;

export const HEADER_HEIGHTS = {
    xs: '54px',
    sm: '60px',
    md: '64px',
    lg: '68px',
    xl: '72px',
} as const;

export const HEADER_SPACING = {
    top: {
        mobile: '0.5rem',    // top-2
        desktop: '0.75rem',  // top-3
    },
    padding: {
        xs: '0.75rem',  // px-3
        sm: '1rem',     // px-4
        md: '1.5rem',   // px-6
    },
    gap: {
        mobile: '0.5rem',   // gap-2
        desktop: '0.75rem', // gap-3
    },
} as const;

export const BRAND_CONFIG = {
    logo: {
        heights: {
            xs: '20px',
            sm: '24px',
            md: '26px',
            lg: '28px',
        },
    },
    text: {
        sizes: {
            xs: '16px',
            sm: '18px',
            md: '20px',
            lg: '22px',
            xl: '24px',
        },
        maxWidths: {
            xs: '120px',
            sm: '180px',
        },
    },
} as const;

export const NAV_LINKS = [
    { href: '/', label: 'Home', mobileOnly: true },
    { href: '/shop', label: 'Shop', mobileOnly: false },
    { href: '/orders', label: 'Orders', mobileOnly: false },
    { href: '/contact', label: 'Contact Us', mobileOnly: false },
    { href: '/account', label: 'Account', mobileOnly: true },
] as const;

export const ICON_SIZES = {
    mobile: 20,
    desktop: 28,
} as const;

export const CART_BADGE_SIZES = {
    mobile: {
        size: '16px',
        fontSize: '9px',
    },
    desktop: {
        size: '20px',
        fontSize: '11px',
    },
} as const;
