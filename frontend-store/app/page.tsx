import { Hero, FeaturedProducts } from "./components/sections";
import { logError } from '@/lib/logger';
import { Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { publicSettingsApi } from "@/lib/app/api/public-settings";

// Skeleton loader for lazy sections
const SectionSkeleton = memo(() => (
    <div className="w-full h-96 animate-pulse bg-white/5 rounded-lg" />
));

// Dynamic imports for below-fold content (reduces initial bundle)
const ScrollingBanner = dynamic(() => import("./components/sections/ScrollingBanner/ScrollingBanner"), {
    loading: () => null,
    ssr: true
});

const Reviews = dynamic(() => import("./components/sections/Reviews/Reviews"), {
    loading: () => <SectionSkeleton />
});

export default async function Home() {
    // Fetch homepage settings from API
    let homepageSettings = null;
    try {
        homepageSettings = await publicSettingsApi.getHomepage();
    } catch (error) {
        logError(error, 'Failed to load homepage settings');
        // Will fall back to hardcoded data in components
    }

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
