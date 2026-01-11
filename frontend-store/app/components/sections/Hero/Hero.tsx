/**
 * Hero Section
 * Main hero carousel with video and image slides
 * Optimized for 10/10 performance and responsiveness
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { memo } from "react";
import { HolographicButton, ScrollHint } from "./components";
import { useHeroCarousel, useVideoPlayer, useIsMobile } from "./hooks";
import { isSlideVisible, getSlideContentClasses } from "./utils";
import { HERO_CONSTANTS, SLIDE_STYLES } from "./constants";
import { HeroProps } from "./types";
import { useSectionSettings } from "@/app/hooks/useSettings";



const Hero = ({ slides: propSlides }: HeroProps = {}) => {
  const shouldReducedMotion = useReducedMotion();
  const isMobile = useIsMobile(768);

  // Fetch hero settings from centralized cache
  const { settings: heroSettings } = useSectionSettings('hero');

  // Use prop slides if provided, otherwise use API/fallback slides
  const slides = propSlides && propSlides.length > 0 ? propSlides : heroSettings?.slides;

  // Custom hooks for state management
  const { videoRef, videoHasPlayed, videoError, setVideoHasPlayed, handleVideoError } =
    useVideoPlayer(0, isMobile);
  const { currentIndex } = useHeroCarousel(slides?.length || 0, videoHasPlayed);


  // Loading state - show skeleton instead of error page
  if (!slides || slides.length === 0) {
    return (
      <section
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-4"
        aria-label="Hero section loading"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black animate-pulse" />
      </section>
    );
  }

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10"
      aria-label="Hero Carousel"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Media layers - crossfade transition with zoom effects */}
      {slides.map((slide: any, index: number) => {
        const isVisible = isSlideVisible(index, currentIndex, videoHasPlayed, slides.length);
        if (!isVisible) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1, filter: isMobile ? "none" : HERO_CONSTANTS.BLUR.INITIAL }}
            animate={{
              opacity: currentIndex === index ? 1 : 0,
              scale: shouldReducedMotion
                ? 1
                : currentIndex === index
                  ? index % 2 === 0
                    ? HERO_CONSTANTS.ZOOM_SCALE.EVEN
                    : HERO_CONSTANTS.ZOOM_SCALE.ODD
                  : index % 2 === 0
                    ? HERO_CONSTANTS.ZOOM_SCALE.ODD
                    : HERO_CONSTANTS.ZOOM_SCALE.EVEN,
              filter: isMobile
                ? "none"
                : currentIndex === index
                  ? HERO_CONSTANTS.BLUR.ACTIVE
                  : HERO_CONSTANTS.BLUR.INITIAL,
            }}
            transition={{
              duration: HERO_CONSTANTS.TRANSITION.DURATION,
              ease: HERO_CONSTANTS.TRANSITION.EASE,
              scale: { duration: HERO_CONSTANTS.TRANSITION.SCALE_DURATION, ease: "linear" },
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              willChange: isMobile ? "opacity, transform" : "opacity, transform, filter",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {slide.type === "video" ? (
              <>
                <video
                  ref={index === 0 ? videoRef : undefined}
                  src={slide.video}
                  poster="/images/banner1.webp"
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover object-center ${videoError ? "hidden" : ""}`}
                  style={{
                    filter: "contrast(1.15) saturate(1.3) brightness(1.05) sharpness(1.1)",
                    transform: "scale(1.05)",
                  }}
                  preload="none"
                  onError={handleVideoError}
                  onEnded={() => setVideoHasPlayed(true)}
                />
                {videoError && (
                  <Image
                    src="/images/hero-fallback.webp"
                    alt="HumanTee Collection"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                )}
              </>
            ) : (
              <>
                <Image
                  src={slide.mobileImage || slide.image || "/images/hero-fallback.webp"}
                  alt={`${slide.heading || "HumanTee Slide"}`}
                  fill
                  className={`object-cover object-center w-full h-full ${slide.mobileImage ? "md:hidden" : ""
                    }`}
                  priority={index === 1}
                />
                {slide.mobileImage && (
                  <Image
                    src={slide.image || "/images/hero-fallback.webp"}
                    alt={slide.heading || "HumanTee Collection"}
                    fill
                    className="hidden md:block object-cover object-center w-full h-full"
                    priority={index === 1}
                  />
                )}
              </>
            )}
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 sm:bg-black/50" />
          </motion.div>
        );
      })}

      {/* Content layers - synchronized crossfade transition */}
      {slides.map((slide: any, index: number) => (
        <motion.div
          key={`content-${index}`}
          initial={{ opacity: index === 0 ? 1 : 0 }}
          animate={{
            opacity: currentIndex === index ? 1 : 0,
            pointerEvents: currentIndex === index ? "auto" : "none",
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-10 flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
            <div className={getSlideContentClasses(index)}>
              {/* Skip content for video slide */}
              {slide.type === "video" ? null : (
                <>
                  {/* Banner 1 */}
                  {index === 1 && slide.subheading1 ? (
                    <>
                      <h1
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-1 sm:mb-2 tracking-wide leading-[1.2] font-bold"
                        style={SLIDE_STYLES.heading}
                      >
                        {slide.heading}
                      </h1>
                      <h2
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-3 sm:mb-4 md:mb-6 tracking-wide leading-[1.2] font-bold"
                        style={SLIDE_STYLES.heading}
                      >
                        {slide.subheading1}
                      </h2>
                      {slide.subheading2 && (
                        <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white mb-4 sm:mb-6 md:mb-8 font-semibold tracking-[0.15em] xs:tracking-[0.20em] uppercase">
                          {slide.subheading2}
                        </h3>
                      )}
                    </>
                  ) : index === 2 ? (
                    /* Banner 2 - Cursive */
                    <>
                      <h1
                        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-1 sm:mb-2 tracking-normal leading-[1.2] font-bold"
                        style={SLIDE_STYLES.cursive}
                      >
                        {slide.heading}
                      </h1>
                      {slide.subheading1 && (
                        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-3 sm:mb-4 md:mb-6 font-semibold tracking-[0.20em] uppercase">
                          {slide.subheading1}
                        </h2>
                      )}
                      {slide.subheading2 && (
                        <h3
                          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 md:mb-8 font-geist font-light tracking-[0.08em]"
                          style={SLIDE_STYLES.tanPearl}
                        >
                          {slide.subheading2}
                        </h3>
                      )}
                    </>
                  ) : (
                    <h1
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 tracking-[0.02em] leading-[1.3] font-geist font-light uppercase"
                      style={SLIDE_STYLES.tanPearl}
                    >
                      {slide.heading}
                    </h1>
                  )}
                </>
              )}

              {/* Luxury Button */}
              {slide.buttonText && (
                <HolographicButton text={slide.buttonText} />
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Scroll Discovery Hint */}
      <ScrollHint />
    </section>
  );
};

// Memo with comparison function for better performance
export default memo(Hero, (prevProps, nextProps) => {
  // Only re-render if slides array reference changes
  if (!prevProps || !nextProps) return false;
  return prevProps.slides === nextProps.slides;
});
