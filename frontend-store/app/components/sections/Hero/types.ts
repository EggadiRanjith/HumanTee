/**
 * Hero Type Definitions
 */

export interface HeroSlide {
    type: "video" | "image";
    video?: string;
    image?: string;
    mobileImage?: string;
    heading?: string;
    subheading1?: string;
    subheading2?: string;
    buttonText?: string;
}

export interface HeroSettings {
    slides: HeroSlide[];
}

export interface HeroProps {
    slides?: HeroSlide[];
}
