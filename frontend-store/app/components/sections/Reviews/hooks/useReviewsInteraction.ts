/**
 * Reviews Interaction Hook
 * Handles user interaction (touch, wheel, mouse) with auto-resume
 */

"use client";

import { useState, useRef, useCallback } from "react";

export function useReviewsInteraction() {
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleUserInteraction = useCallback(() => {
        setIsUserInteracting(true);

        // Clear existing pause timer
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
        }

        // Resume after 4 seconds of no interaction
        pauseTimerRef.current = setTimeout(() => {
            setIsUserInteracting(false);
        }, 4000);
    }, []);

    return { isUserInteracting, handleUserInteraction };
}
