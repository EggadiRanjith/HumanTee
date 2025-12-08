"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Type definitions for hero slides
type VideoSlide = {
  type: "video";
  video: string;
  heading?: string;
  subheading?: string;
  subheading1?: string;
  buttonText?: string;
};

type ImageSlide = {
  type: "image";
  image: string;
  mobileImage?: string; // Optional mobile-specific image
  heading: string;
  subheading1: string;
  subheading2: string;
  buttonText: string;
};

type HeroSlide = VideoSlide | ImageSlide;

// Hero slide data with individual content for each image/video
const heroSlides = [
  {
    type: "video" as const,
    video: "/video/introvideo.mp4"
  },
  {
    type: "image" as const,
    image: "/images/banner1.png",
    mobileImage: "/images/banner1-mobile.png",
    heading: "Years Of Legacy",
    subheading1: "Since 1931",
    subheading2: "Available in all sizes",
    buttonText: "Shop Now"
  },
  {
    type: "image" as const,
    image: "/images/banner2.png",
    mobileImage: "/images/banner2mobile.png",
    heading: "Apart from beginning",
    subheading1: "Available in all sizes",
    subheading2: "",
    buttonText: "Shop Now"
  }
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoHasPlayed, setVideoHasPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restart video when slide becomes active
  useEffect(() => {
    if (currentImageIndex === 0 && videoRef.current && !videoHasPlayed) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(e => console.log("Video play failed:", e));
    }
  }, [currentImageIndex, videoHasPlayed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        // After video plays once, mark it as played and move to first banner
        if (prevIndex === 0 && !videoHasPlayed) {
          setVideoHasPlayed(true);
          return 1; // Move to banner1
        }
        // After video has played, alternate between banner1 (index 1) and banner2 (index 2)
        if (videoHasPlayed) {
          return prevIndex === 1 ? 2 : 1;
        }
        return prevIndex;
      });
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [videoHasPlayed]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-6">
      {/* Media layers - crossfade transition with zoom effects */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1, filter: "blur(10px)" }}
          animate={{
            opacity: currentImageIndex === index ? 1 : 0,
            scale: currentImageIndex === index ? (index % 2 === 0 ? 1.05 : 1) : (index % 2 === 0 ? 1 : 1.05),
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
            <video
              ref={index === 0 ? videoRef : undefined}
              src={slide.video}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              style={{
                filter: "contrast(1.15) saturate(1.3) brightness(1.05) sharpness(1.1)",
                transform: "scale(1.05) translateZ(0)",
                willChange: "transform",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
                WebkitBackfaceVisibility: "hidden",
              }}
              preload="metadata"
              onError={(e) => {
                console.error("Video failed to load:", e);
              }}
            />
          ) : (
            <>
              {/* Mobile Image - shown on screens < 768px */}
              {slide.mobileImage && (
                <Image
                  src={slide.mobileImage}
                  alt={`${slide.heading} - ${slide.subheading1}`}
                  fill
                  className="object-cover object-center w-full h-full md:hidden"
                  priority={index === 0}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = slide.image; // Fallback to desktop image
                  }}
                />
              )}
              {/* Desktop Image - shown on screens >= 768px OR if no mobile image */}
              <Image
                src={slide.image}
                alt={`${slide.heading} - ${slide.subheading1}`}
                fill
                className={`object-cover object-center w-full h-full ${slide.mobileImage ? 'hidden md:block' : ''}`}
                priority={index === 0}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1616486338815-671e077e0f40?q=80&w=1000&auto=format&fit=crop';
                }}
              />
            </>
          )}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      ))}

      {/* Content layers - synchronized crossfade transition */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={`content-${index}`}
          initial={{ opacity: index === 0 ? 1 : 0 }}
          animate={{ opacity: currentImageIndex === index ? 1 : 0, pointerEvents: currentImageIndex === index ? 'auto' : 'none' }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
          className="absolute inset-0 z-10 flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
            <div className={`max-w-2xl ${index === 1 ? 'mt-16 sm:mt-12 md:mt-8 lg:mt-0' : index === 2 ? 'mt-8 sm:mt-4 md:mt-0 lg:-mt-8' : 'mt-32 sm:mt-24 md:mt-16 lg:mt-0'}`}>
              {/* Skip content for video slide */}
              {slide.type === 'video' ? null : (
                <>
                  {/* Banner 1 - Combined Heading with Zalando Sans */}
                  {index === 1 && slide.subheading1 ? (
                    <>
                      <h1
                        className="
                          text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                          text-white mb-2
                          tracking-wide leading-[1.1]
                          font-bold
                          px-2 sm:px-4 md:px-6
                        "
                        style={{
                          fontFamily: "var(--font-zalando-sans)",
                          fontOpticalSizing: 'auto',
                          fontWeight: 700
                        }}
                      >
                        {slide.heading}
                      </h1>
                      <h2
                        className="
                          text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                          text-white mb-6
                          tracking-wide leading-[1.1]
                          font-bold
                          px-2 sm:px-4 md:px-6
                        "
                        style={{
                          fontFamily: "var(--font-zalando-sans)",
                          fontOpticalSizing: 'auto',
                          fontWeight: 700
                        }}
                      >
                        {slide.subheading1}
                      </h2>
                      {/* Subheading2 for Banner 1 */}
                      {slide.subheading2 && (
                        <h3
                          className="
                            text-base sm:text-lg md:text-xl lg:text-2xl 
                            text-white mb-8 sm:mb-12 
                            font-semibold
                            tracking-[0.20em]
                            leading-relaxed
                            uppercase
                            px-2 sm:px-4 md:px-6
                          "
                        >
                          {slide.subheading2}
                        </h3>
                      )}
                    </>
                  ) : index === 2 ? (
                    /* Banner 2 - Bonheur Royale Cursive Font */
                    <>
                      <h1
                        className="
                          text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 
                          text-white mb-1 sm:mb-2
                          tracking-normal leading-[1.2]
                          font-bold
                          px-2 sm:px-4 md:px-6
                        "
                        style={{
                          fontFamily: "var(--font-bonheur-royale)",
                          fontWeight: 700
                        }}
                      >
                        {slide.heading}
                      </h1>
                      {/* Subheading1 for Banner 2 */}
                      {slide.subheading1 && (
                        <h2
                          className="
                            text-base sm:text-lg md:text-xl lg:text-2xl 
                            text-white mb-4 sm:mb-6
                            font-semibold
                            tracking-[0.20em]
                            leading-relaxed
                            uppercase
                            px-2 sm:px-4 md:px-6
                          "
                        >
                          {slide.subheading1}
                        </h2>
                      )}
                      {/* Subheading2 for Banner 2 */}
                      {slide.subheading2 && (
                        <h3
                          className="
                            text-base sm:text-lg md:text-xl lg:text-2xl 
                            text-white/90 mb-8 sm:mb-12 
                            font-geist font-light
                            tracking-[0.08em]
                            leading-relaxed
                            px-2 sm:px-4 md:px-6
                          "
                          style={{
                            fontFamily: "var(--font-tan-pearl)",
                            fontOpticalSizing: 'auto'
                          }}
                        >
                          {slide.subheading2}
                        </h3>
                      )}
                    </>
                  ) : (
                    /* Default Heading for other slides */
                    <h1
                      className="
                        text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                        text-white mb-4 sm:mb-6 
                        tracking-[0.02em] leading-[1.3]
                        font-geist font-light
                        uppercase
                        px-2 sm:px-4 md:px-6
                      "
                      style={{
                        fontFamily: "var(--font-tan-pearl)",
                        fontOpticalSizing: 'auto'
                      }}
                    >
                      {slide.heading}
                    </h1>
                  )}
                </>
              )}

              {/* Luxury Button - only show if buttonText exists */}
              {slide.buttonText && (
                <Link href="/shop" className="inline-block">
                  <button
                    className="
                      relative
                      px-6 sm:px-8 md:px-10 lg:px-12
                      py-2.5 sm:py-3 md:py-4
                      font-geist font-semibold
                      text-[11px] sm:text-[12px] md:text-[14px] tracking-[0.15em] uppercase
                      rounded-full
                      border border-white/20
                      luxury-glass
                      shadow-floating
                      backdrop-blur-xl
                      overflow-hidden
                      transition-all duration-700
                      ease-[cubic-bezier(0.25,1,0.3,1)]
                      hover:scale-105
                      hover:shadow-glow-cyan
                      text-white
                      min-h-[44px] sm:min-h-[48px] md:min-h-[56px]
                      touch-target
                      mx-2 sm:px-4 md:mx-6
                    "
                    type="button"
                  >
                    {/* Subtle Inner Glow */}
                    <span className="
                      absolute inset-0 
                      rounded-full 
                      bg-white/10
                      opacity-0
                      group-hover:opacity-20
                      transition-opacity
                      duration-700
                    " />

                    {/* Aurora Line Sweep */}
                    <span
                      className="
                        pointer-events-none
                        absolute
                        top-0 left-0
                        h-full w-[90px]
                        bg-gradient-to-r
                        from-transparent
                        via-white/40
                        to-transparent
                        opacity-0
                        group-hover:opacity-60
                        blur-[22px]
                        translate-x-[-120%]
                        group-hover:translate-x-[180%]

                        transition-all
                        duration-[1200ms]
                        ease-[cubic-bezier(0.25,1,0.3,1)]
                      "
                    />

                    {/* Button Text */}
                    <span className="relative z-10 tracking-wider">
                      {slide.buttonText}
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Hero;
