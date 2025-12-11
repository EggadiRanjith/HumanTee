"use client";

import { Hero } from "./components/sections";
import { useState, useEffect, lazy, Suspense } from "react";
import { useLoading } from "./components/context/LoadingContext";
import { INTRO_DURATION } from "./constants/animations.constants";

// Lazy load IntroLoader (only loads on first visit)
const IntroLoader = lazy(() => import('./components/ui/loaders').then(m => ({ default: m.IntroLoader })));

// Lazy load below-fold sections for better performance
const FeaturedProducts = lazy(() => import('./components/sections').then(m => ({ default: m.FeaturedProducts })));
const ScrollingBanner = lazy(() => import('./components/sections').then(m => ({ default: m.ScrollingBanner })));
const Reviews = lazy(() => import('./components/sections').then(m => ({ default: m.Reviews })));

// Skeleton loader for lazy sections
const SectionSkeleton = () => (
    <div className="w-full h-96 animate-pulse bg-white/5 rounded-lg" />
);

export default function Home() {
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

    return (
        <>
            {showIntro && (
                <Suspense fallback={null}>
                    <IntroLoader
                        duration={INTRO_DURATION}
                        variant="cinematic"
                        onComplete={handleIntroComplete}
                    />
                </Suspense>
            )}

            {/* Hide all content until intro is complete */}
            {!showIntro && (
                <>
                    {/* Above-fold - Load immediately */}
                    <Hero />

                    {/* Below-fold - Lazy load with Suspense */}
                    <Suspense fallback={<SectionSkeleton />}>
                        <FeaturedProducts />
                    </Suspense>

                    <Suspense fallback={null}>
                        <ScrollingBanner />
                    </Suspense>

                    <Suspense fallback={<SectionSkeleton />}>
                        <Reviews />
                    </Suspense>
                </>
            )}
        </>
    );
}
