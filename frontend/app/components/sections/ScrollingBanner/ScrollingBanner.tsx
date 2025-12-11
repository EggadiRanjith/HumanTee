/**
 * ScrollingBanner Section
 * Displays promotional messages in an infinite scrolling banner
 * Refactored to use centralized data
 */

"use client";

import { motion } from "framer-motion";
import { bannerMessages } from '@/app/data/banner-messages.data';
import { SCROLL_ANIMATION_DURATION } from '@/app/constants/animations.constants';

const ScrollingBanner = () => {
  return (
    <section className="relative w-full py-4 overflow-hidden bg-white border-y border-gray-200">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Scrolling container */}
      <div className="relative flex items-center">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: SCROLL_ANIMATION_DURATION,
              ease: "linear",
            },
          }}
        >
          {/* Render messages twice for seamless loop */}
          {[...bannerMessages, ...bannerMessages].map((message, index) => (
            <div
              key={index}
              className="inline-flex items-center px-8 text-[11px] uppercase tracking-[0.3em] text-gray-800 font-light"
            >
              <span className="text-gray-400 mx-2">•</span>
              {message}
              <span className="text-gray-400 mx-2">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollingBanner;
