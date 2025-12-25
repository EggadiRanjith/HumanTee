/**
 * Reviews Animation Hook
 * Manages smooth auto-scroll animation with RAF
 * Fixed: Seamless infinite scroll without flickering
 */

"use client";

import { useEffect, useRef, RefObject } from "react";

export function useReviewsAnimation(
    scrollRef: RefObject<HTMLDivElement | null>,
    isUserInteracting: boolean
) {
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = () => {
            if (scrollRef.current && !isUserInteracting) {
                const container = scrollRef.current;
                const maxScroll = container.scrollWidth - container.clientWidth;
                const halfScroll = maxScroll / 2;

                // Seamless infinite scroll: reset at halfway point (where duplicates start)
                if (container.scrollLeft >= halfScroll) {
                    // Instant reset to start (no smooth behavior = no flicker)
                    container.scrollLeft = 0;
                } else {
                    // Continuous smooth scroll (1px per frame = ~60px/sec at 60fps)
                    container.scrollLeft += 1;
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [scrollRef, isUserInteracting]);
}
