/**
 * Footer Type Definitions
 */

export interface FooterSettings {
    brand_name: string;
    logo_url: string | null;
    tagline: string;
    social_links: {
        instagram: string;
        maps: string;
    };
    contact: {
        email: string;
        phone: string;
    };
}

export interface NavSection {
    title: string;
    links: NavLink[];
}

export interface NavLink {
    name: string;
    url: string;
}
