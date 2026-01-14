"use client";

import { Hero, FeaturedProducts } from "./components/sections";
import { Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { useSettings } from "./contexts/SettingsContext";

// Skeleton loader for lazy sections
const SectionSkeleton = memo(() => (
    <div className="w-full h-96 animate-pulse bg-white/5 rounded-lg" />
));

// Dynamic imports for below-fold content (reduces initial bundle)
const ScrollingBanner = dynamic(() => import("./components/sections/ScrollingBanner/ScrollingBanner"), {
    loading: () => null,
    ssr: false
});

const Reviews = dynamic(() => import("./components/sections/Reviews/Reviews"), {
    loading: () => <SectionSkeleton />,
    ssr: false
});

export default function Home() {
    // ✅ OPTIMIZED: Use shared settings context (1 API call for entire app)
    const { settings } = useSettings();
    const homepageSettings = settings?.homepage;

    return (
        <>
            {/* Above-fold - Load immediately */}
            <Hero slides={homepageSettings?.hero_slides?.slides} />

            {/* Below-fold - Lazy load with Suspense */}
            <Suspense fallback={<SectionSkeleton />}>
                <FeaturedProducts />
            </Suspense>

            <Suspense fallback={null}>
                <ScrollingBanner messages={homepageSettings?.banner_messages?.messages} />
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
                <Reviews
                    reviews={homepageSettings?.reviews?.reviews}
                    enabled={homepageSettings?.reviews_settings?.enabled}
                />
            </Suspense>
        </>
    );
}
