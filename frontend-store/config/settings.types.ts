/**
 * Type definitions for application settings
 */

export interface SocialLinks {
    instagram: string;
    maps: string;
}

export interface ContactInfo {
    email: string;
    phone: string;
}

export interface HeaderFooterSettings {
    brand_name: string;
    tagline: string;
    logo_url: string | null;
    social_links: SocialLinks;
    contact: ContactInfo;
}

export interface HeroSettings {
    title: string;
    subtitle: string;
    cta_text: string;
    video_url: string;
}

export interface SectionSettings {
    enabled: boolean;
    title: string;
    subtitle?: string;
}

export interface HomepageSettings {
    hero: HeroSettings;
    featured_section: SectionSettings;
    reviews_section: SectionSettings;
}

export interface ShopSettings {
    default_sort: string;
    items_per_page: number;
    show_filters: boolean;
}

export interface CheckoutSettings {
    free_shipping_threshold: number;
    currency: string;
    payment_methods: string[];
}

export interface AppSettings {
    'header-footer': HeaderFooterSettings;
    homepage: HomepageSettings;
    shop: ShopSettings;
    checkout: CheckoutSettings;
}
