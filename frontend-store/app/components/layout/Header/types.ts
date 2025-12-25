/**
 * Header Component Type Definitions
 * Centralized TypeScript interfaces for Header and subcomponents
 */

export interface HeaderSettings {
    brand_name: string;
    logo_url: string | null;
}

export interface NavLink {
    href: string;
    label: string;
    mobileOnly?: boolean;
}

export interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
    headerHeight: number;
}

export interface CartBadgeProps {
    count: number;
    variant?: 'mobile' | 'desktop';
}

export interface HeaderProps {
    // Future: Add props if Header becomes configurable
}
