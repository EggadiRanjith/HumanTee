import { Hero, FeaturedProducts } from "./components/sections";
import { Suspense, memo } from "react";
import dynamic from "next/dynamic";

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

export default function Home() {
    return (
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
    );
}
