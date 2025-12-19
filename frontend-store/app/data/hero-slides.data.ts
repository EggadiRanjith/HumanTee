/**
 * Hero Slides Data
 * Configuration for hero carousel slides
 */

// Type definitions for hero slides
export type VideoSlide = {
    type: "video";
    video: string;
    heading?: string;
    subheading?: string;
    subheading1?: string;
    buttonText?: string;
};

export type ImageSlide = {
    type: "image";
    image: string;
    mobileImage?: string;
    heading: string;
    subheading1: string;
    subheading2: string;
    buttonText: string;
};

export type HeroSlide = VideoSlide | ImageSlide;

// Hero slide data
export const heroSlides: HeroSlide[] = [
    {
        type: "video",
        video: "/video/introvideo.mp4"
    },
    {
        type: "image",
        image: "/images/banner1.png",
        mobileImage: "/images/banner1-mobile.png",
        heading: "Years Of Legacy",
        subheading1: "Since 1931",
        subheading2: "Available in all sizes",
        buttonText: "Shop Now"
    },
    {
        type: "image",
        image: "/images/banner2.png",
        mobileImage: "/images/banner2mobile.png",
        heading: "Apart from beginning",
        subheading1: "Available in all sizes",
        subheading2: "",
        buttonText: "Shop Now"
    }
];
