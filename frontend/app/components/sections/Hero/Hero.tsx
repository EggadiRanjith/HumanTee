"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Type definitions for hero slides
type VideoSlide = {
  type: "video";
  video: string;
  heading: string;
  subheading: string;
  buttonText: string;
};

type ImageSlide = {
  type: "image";
  image: string;
  heading: string;
  subheading: string;
  buttonText: string;
};

type HeroSlide = VideoSlide | ImageSlide;

// Hero slide data with individual content for each image/video
const heroSlides = [
  {
    type: "video" as const,
    video: "/video/introvideo.mp4",
    heading: "Timeless Elegance",
    subheading: "Crafted for the Discerning",
    buttonText: "Discover Collection"
  },
  {
    type: "image" as const,
    image: "/images/banner2.png",
    heading: "Luxury Redefined",
    subheading: "Where Art Meets Precision",
    buttonText: "Explore Excellence"
  }
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restart video when slide becomes active
  useEffect(() => {
    if (currentImageIndex === 0 && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(e => console.log("Video play failed:", e));
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)] px-6">
      {/* Media layers - crossfade transition */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: "opacity",
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
              loop
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
            <Image
              src={slide.image}
              alt={`${slide.heading} - ${slide.subheading}`}
              fill
              className="object-cover object-center w-full h-full"
              priority={index === 0}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://images.unsplash.com/photo-1616486338815-671e077e0f40?q=80&w=1000&auto=format&fit=crop';
              }}
            />
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
          animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="absolute inset-0 z-10 flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
            <div className="max-w-2xl mt-32 sm:mt-24 md:mt-16 lg:mt-0">
              {/* Heading */}
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

              {/* Subheading */}
              <h2
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
                {slide.subheading}
              </h2>

              {/* Luxury Button */}
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
                  mx-2 sm:mx-4 md:mx-6
                "
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
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Hero;
