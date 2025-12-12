"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useLoading } from "./context/LoadingContext";
import { INTRO_DURATION } from "../constants/animations.constants";

// Lazy load IntroLoader (only loads on first visit)
const IntroLoader = lazy(() => import('./ui/loaders').then(m => ({ default: m.IntroLoader })));

export function IntroWrapper() {
    const [showIntro, setShowIntro] = useState(false);
    const { setLoading } = useLoading();

    useEffect(() => {
        // STRICT RULE: Only show intro on absolute first visit to domain
        const hasVisitedDomain = sessionStorage.getItem('has-visited-domain');

        if (hasVisitedDomain) {
            // User has visited before - NEVER show intro again
            setShowIntro(false);
            setLoading(false);
        } else {
            // First time ever visiting this domain - show intro once
            sessionStorage.setItem('has-visited-domain', 'true');
            setShowIntro(true);
        }
    }, [setLoading]);

    const handleIntroComplete = () => {
        setShowIntro(false);
        setLoading(false);
    };

    if (!showIntro) return null;

    return (
        <Suspense fallback={null}>
            <IntroLoader
                duration={INTRO_DURATION}
                variant="cinematic"
                onComplete={handleIntroComplete}
            />
        </Suspense>
    );
}
