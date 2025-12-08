"use client";

import { Hero, FeaturedProducts, Reviews } from "./components/sections";
import IntroLoader from "./components/ui/IntroLoader";
import { useState, useEffect } from "react";
import { useLoading } from "./components/context/LoadingContext";

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
                <IntroLoader 
                    duration={3500}
                    variant="cinematic"
                    onComplete={handleIntroComplete}
                />
            )}
            
            {/* Hide all content until intro is complete */}
            {!showIntro && (
                <>
                    <Hero />
                    <FeaturedProducts />
                    <Reviews />
                </>
            )}
        </>
    );
}
