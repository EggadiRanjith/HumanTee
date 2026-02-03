/**
 * Hero Carousel Hook
 * Manages slide navigation and auto-advance logic
 */

import { useState, useEffect } from "react";
import { HERO_SLIDE_INTERVAL } from "@/app/constants/animations.constants";

import { HeroSlide } from "../types";

export function useHeroCarousel(slides: HeroSlide[], videoHasPlayed: boolean) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = slides.length;

    // Auto-advance slides
    useEffect(() => {
        if (totalSlides <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % totalSlides;

                // If we have a video and it has already played, 
                // we might want to skip it in the next cycle if we prefer to loop images only.
                // However, the standard behavior should just cycle all content.
                // The requirement says "when its video dont show any content".
                // We'll keep the cycling simple and just handle visibility in the component.

                return nextIndex;
            });
        }, HERO_SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [totalSlides, slides]);

    return { currentIndex, setCurrentIndex };
}
