/**
 * Hero Section
 * Main hero carousel with video and image slides
 * Includes luxury mobile animations: Scroll Hint (Classic Explore), Holographic Shimmer
 */

"use client";

import { motion, useReducedMotion, useScroll, useTransform, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { heroSlides, HeroSlide } from '@/app/data/hero-slides.data';
import { HERO_SLIDE_INTERVAL } from '@/app/constants/animations.constants';

// --- Reusable Holographic Button Component ---
const HolographicButton = ({ text }: { text: string }) => {
  // Simulated Gyro / Mouse Parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    x.set(clientX - rect.left);
    y.set(clientY - rect.top);
  };

  return (
    <Link href="/shop" className="inline-block relative group">
      <motion.button
        className="
          relative overflow-hidden
          px-8 sm:px-10 md:px-12
          py-3 sm:py-3.5 md:py-4
          font-geist font-semibold
          text-[12px] sm:text-[13px] md:text-[14px] tracking-[0.25em] uppercase
          rounded-full
          border border-white/20
          bg-white/5 backdrop-blur-xl
          text-white
          transition-all duration-500
          hover:scale-[1.03] hover:border-white/40
        "
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        whileTap={{ scale: 0.97 }}
      >
        {/* Ambient Holographic Sheen (Auto-Loop) */}
        <motion.div
          className="absolute inset-0 opacity-40 pointer-events-none"
          animate={{
            background: [
              "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 20%, transparent 100%)",
              "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 80%, transparent 100%)"
            ],
            backgroundPosition: ["200% 0", "-200% 0"]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />

        {/* Interaction Glow (Follows Finger/Mouse) */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25), transparent 60%)`
          }}
        />

        <span className="relative z-10">{text}</span>
      </motion.button>
    </Link>
  );
};

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoHasPlayed, setVideoHasPlayed] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]); // Fade out scroll hint

  // Restart video when slide becomes active
  useEffect(() => {
    if (currentImageIndex === 0 && videoRef.current && !videoHasPlayed) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(() => {
        setVideoError(true);
      });
    }
  }, [currentImageIndex, videoHasPlayed]);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        // After video plays once, mark it as played and move to first banner
        if (prevIndex === 0 && !videoHasPlayed) {
          setVideoHasPlayed(true);
          return 1;
        }
        // After video has played, alternate between banner1 (index 1) and banner2 (index 2)
        if (videoHasPlayed) {
          return prevIndex === 1 ? 2 : 1;
        }
        return prevIndex;
      });
    }, HERO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [videoHasPlayed]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-6"
      aria-label="Hero Carousel"
    >
      {/* Media layers - crossfade transition with zoom effects */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1, filter: "blur(10px)" }}
          animate={{
            opacity: currentImageIndex === index ? 1 : 0,
            scale: shouldReducedMotion ? 1 : (currentImageIndex === index ? (index % 2 === 0 ? 1.05 : 1) : (index % 2 === 0 ? 1 : 1.05)),
            filter: currentImageIndex === index ? "blur(0px)" : "blur(10px)"
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            scale: { duration: 6, ease: "linear" }
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: "opacity, transform, filter",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {slide.type === "video" ? (
            <>
              <video
                ref={index === 0 ? videoRef : undefined}
                src={slide.video}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover object-center ${videoError ? 'hidden' : ''}`}
                style={{
                  filter: "contrast(1.15) saturate(1.3) brightness(1.05) sharpness(1.1)",
                  transform: "scale(1.05)",
                }}
                preload="metadata"
                onError={() => {
                  setVideoError(true);
                }}
              />
              {videoError && (
                <Image
                  src="/images/hero-fallback.jpg"
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
                src={slide.mobileImage || slide.image}
                alt={`${slide.heading}`}
                fill
                className={`object-cover object-center w-full h-full ${slide.mobileImage ? 'md:hidden' : ''}`}
                priority={index === 1}
              />
              {slide.mobileImage && (
                <Image
                  src={slide.image}
                  alt={slide.heading}
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
      ))}

      {/* Content layers - synchronized crossfade transition */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={`content-${index}`}
          initial={{ opacity: index === 0 ? 1 : 0 }}
          animate={{ opacity: currentImageIndex === index ? 1 : 0, pointerEvents: currentImageIndex === index ? 'auto' : 'none' }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-10 flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
            <div className={`max-w-2xl ${index === 1 ? 'mt-16 sm:mt-12 md:mt-8 lg:mt-0' : index === 2 ? 'mt-8 sm:mt-4 md:mt-0 lg:-mt-8' : 'mt-32 sm:mt-24 md:mt-16 lg:mt-0'}`}>

              {/* Skip content for video slide */}
              {slide.type === 'video' ? null : (
                <>
                  {/* Banner 1 */}
                  {index === 1 && slide.subheading1 ? (
                    <>
                      <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-2 tracking-wide leading-[1.1] font-bold px-2 sm:px-4 md:px-6"
                        style={{ fontFamily: "var(--font-zalando-sans)", fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                      >
                        {slide.heading}
                      </h1>
                      <h2
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 tracking-wide leading-[1.1] font-bold px-2 sm:px-4 md:px-6"
                        style={{ fontFamily: "var(--font-zalando-sans)", fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                      >
                        {slide.subheading1}
                      </h2>
                      {slide.subheading2 && (
                        <h3
                          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-8 sm:mb-12 font-semibold tracking-[0.20em] uppercase px-2 sm:px-4 md:px-6"
                        >
                          {slide.subheading2}
                        </h3>
                      )}
                    </>
                  ) : index === 2 ? (
                    /* Banner 2 - Cursive */
                    <>
                      <h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white mb-1 sm:mb-2 tracking-normal leading-[1.2] font-bold px-2 sm:px-4 md:px-6"
                        style={{ fontFamily: "var(--font-bonheur-royale)", fontWeight: 700 }}
                      >
                        {slide.heading}
                      </h1>
                      {slide.subheading1 && (
                        <h2
                          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-4 sm:mb-6 font-semibold tracking-[0.20em] uppercase px-2 sm:px-4 md:px-6"
                        >
                          {slide.subheading1}
                        </h2>
                      )}
                      {slide.subheading2 && (
                        <h3
                          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 font-geist font-light tracking-[0.08em] px-2 sm:px-4 md:px-6"
                          style={{ fontFamily: "var(--font-tan-pearl)" }}
                        >
                          {slide.subheading2}
                        </h3>
                      )}
                    </>
                  ) : (
                    <h1
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 tracking-[0.02em] leading-[1.3] font-geist font-light uppercase px-2 sm:px-4 md:px-6"
                      style={{ fontFamily: "var(--font-tan-pearl)" }}
                    >
                      {slide.heading}
                    </h1>
                  )}
                </>
              )}

              {/* Luxury Button */}
              {slide.buttonText && (
                <div className="px-2 sm:px-4 md:px-6">
                  <HolographicButton text={slide.buttonText} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* 2. SCROLL DISCOVERY HINT (Old 'Explore' Version) */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-geist">Explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
