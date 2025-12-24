import { Hero, FeaturedProducts } from "./components/sections";
import { Suspense, memo } from "react";
import dynamic from "next/dynamic";
import { publicSettingsApi } from "./lib/api/public-settings";

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
        console.log('🔍 Fetching homepage settings from API...');
        homepageSettings = await publicSettingsApi.getHomepage();
        console.log('✅ Homepage settings loaded:', homepageSettings);
    } catch (error) {
        console.error('❌ Failed to load homepage settings:', error);
        // Will fall back to hardcoded data in components
    }

    // Log what we're passing to components (server-side only)
    console.log('📤 Passing to Hero:', homepageSettings?.hero_slides?.slides);
    console.log('📤 Passing to Banner:', homepageSettings?.banner_messages?.messages);
    console.log('📤 Passing to Reviews:', homepageSettings?.reviews?.reviews);

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
