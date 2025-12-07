"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

// Hero slide data with individual content for each image
const heroSlides = [
  {
    image: "/banner1.png",
    heading: "Years of legacy",
    subheading: "Since 1995",
    buttonText: "Buy Now"
  },
  {
    image: "/banner2.png",
    heading: "Apart from beginning",
    subheading: "Available in all sizes",
    buttonText: "Buy Now"
  }
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)]">
      {/* Image layers - crossfade transition */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={`image-${index}`}
          initial={{ opacity: index === 0 ? 1 : 0 }}
          animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="absolute inset-0 w-full h-full"
        >
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
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-2xl">
              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  y: currentImageIndex === index ? 0 : 20
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.1
                }}
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 tracking-tight ${index === 0
                    ? 'font-[\'Zalando_Sans_Expanded\',sans-serif] font-light'
                    : index === 1
                      ? 'font-[\'Meddon\',cursive] font-normal'
                      : 'font-bold'
                  }`}
                style={index === 0 ? { fontOpticalSizing: 'auto' } : undefined}
              >
                {slide.heading}
              </motion.h1>

              {/* Subheading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  y: currentImageIndex === index ? 0 : 20
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.2
                }}
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 font-light tracking-wide ${index === 0 ? 'font-[\'Zalando_Sans_Expanded\',sans-serif]' : ''
                  }`}
                style={index === 0 ? { fontOpticalSizing: 'auto' } : undefined}
              >
                {slide.subheading}
              </motion.h2>

              {/* Buy Now Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  y: currentImageIndex === index ? 0 : 20
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.3
                }}
                className="px-8 py-4 bg-white text-black font-semibold text-lg rounded-full hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                {slide.buttonText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Hero;
