"use client";

import { Hero, FeaturedProducts, Reviews } from "./components/sections";
import IntroLoader from "./components/ui/IntroLoader";
import { useState, useEffect } from "react";
import { useLoading } from "./components/context/LoadingContext";

export default function Home() {
    const [showIntro, setShowIntro] = useState(true);
    const { setLoading } = useLoading();

    useEffect(() => {
        // For testing: clear sessionStorage and always show loader
        sessionStorage.removeItem('has-visited-homepage');
        
        // Check if this is the first visit or refresh
        const hasVisited = sessionStorage.getItem('has-visited-homepage');
        
        if (hasVisited) {
            setShowIntro(false);
            setLoading(false);
        } else {
            sessionStorage.setItem('has-visited-homepage', 'true');
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
