/**
 * Footer Design Tokens & Constants
 */

import type { NavSection } from './types';

export const FOOTER_NAV_SECTIONS: NavSection[] = [
    {
        title: 'Shop',
        links: [
            { name: 'Orders', url: '/orders' },
            { name: 'Account', url: '/account' },
            { name: 'All Products', url: '/shop' },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'Shipping', url: '/shipping' },
            { name: 'Terms & Privacy', url: '/terms-privacy' },
            { name: '+91 7780-661493', url: 'tel:+917780661493' },
            { name: 'humanteeofficial@gmail.com', url: 'mailto:humanteeofficial@gmail.com' },
        ],
    },
] as const;

export const DROPDOWN_ANIMATION = {
    hidden: { opacity: 0, height: 0, y: -8, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        height: "auto",
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] },
    },
    exit: {
        opacity: 0,
        height: 0,
        y: -6,
        filter: "blur(6px)",
        transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
    },
} as const;
