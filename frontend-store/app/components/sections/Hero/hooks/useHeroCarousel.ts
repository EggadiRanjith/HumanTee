/**
 * Hero Carousel Hook
 * Manages slide navigation and auto-advance logic
 */

import { useState, useEffect } from "react";
import { HERO_SLIDE_INTERVAL } from "@/app/constants/animations.constants";

export function useHeroCarousel(totalSlides: number, videoHasPlayed: boolean) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                // After video plays once, mark it as played and move to first banner
                if (prevIndex === 0 && !videoHasPlayed) {
                    return 1;
                }

                // After video has played, cycle through all remaining slides (excluding video at index 0)
                if (videoHasPlayed) {
                    const nextIndex = prevIndex + 1;
                    // If we've reached the end, go back to slide 1 (skip video at 0)
                    return nextIndex >= totalSlides ? 1 : nextIndex;
                }

                return prevIndex;
            });
        }, HERO_SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [videoHasPlayed, totalSlides]);

    return { currentIndex, setCurrentIndex };
}
