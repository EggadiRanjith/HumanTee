/**
 * ScrollingBanner Section
 * Displays promotional messages in an infinite scrolling banner
 * Optimized with pure CSS animation and mobile responsiveness
 */

"use client";

import { memo } from "react";
import { bannerMessages } from '@/app/data/banner-messages.data';

const ScrollingBanner = () => {
  return (
    <section className="relative w-full py-3 xs:py-4 overflow-hidden bg-white border-y border-gray-200">
      {/* Gradient overlays for smooth fade effect - Mobile optimized */}
      <div className="absolute left-0 top-0 bottom-0 w-12 xs:w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 xs:w-16 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Scrolling container - Pure CSS Animation */}
      <div className="relative flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Render messages twice for seamless loop */}
          {[...bannerMessages, ...bannerMessages].map((message, index) => (
            <div
              key={index}
              className="inline-flex items-center px-6 xs:px-8 text-[10px] xs:text-[11px] uppercase tracking-[0.25em] xs:tracking-[0.3em] text-gray-800 font-light"
            >
              <span className="text-gray-400 mx-2">•</span>
              {message}
              <span className="text-gray-400 mx-2">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default memo(ScrollingBanner);
