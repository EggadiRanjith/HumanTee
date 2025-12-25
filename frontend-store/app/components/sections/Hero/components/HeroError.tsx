/**
 * Hero Error State
 * Fallback UI when hero slides fail to load
 */

import Link from "next/link";

export default function HeroError() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-4"
            aria-label="Hero section"
        >
            {/* Fallback gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black" />

            <div className="relative z-10 text-center max-w-2xl px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl text-white mb-4 font-bold">
                    Welcome to HumanTee
                </h1>
                <p className="text-white/80 mb-8 text-lg">Premium Custom Apparel</p>
                <Link
                    href="/shop"
                    className="inline-block px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all min-h-[44px]"
                >
                    SHOP NOW
                </Link>
            </div>
        </section>
    );
}
