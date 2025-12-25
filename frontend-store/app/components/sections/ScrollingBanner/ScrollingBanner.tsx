/**
 * ScrollingBanner Section
 * Displays promotional messages in an infinite scrolling banner
 * Optimized with API integration, fallback support, and accessibility
 */

"use client";

import { useState, useEffect, memo } from "react";
import { BannerSkeleton } from "./components";
import { useSectionSettings } from "@/app/hooks/useSettings";

interface ScrollingBannerProps {
  messages?: string[];
}

const ScrollingBanner = ({ messages: propMessages }: ScrollingBannerProps = {}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Get banner settings from centralized cache
  const { settings, isLoading: settingsLoading } = useSectionSettings('banner');

  // Use prop messages if provided, otherwise use API/fallback messages
  const messages = propMessages && propMessages.length > 0 ? propMessages : (settings?.messages || []);

  // Loading state
  useEffect(() => {
    if (!settingsLoading) {
      const timer = setTimeout(() => setIsLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [settingsLoading]);

  // Don't render if no messages
  if (messages.length === 0) return null;
  if (isLoading) return <BannerSkeleton />;

  return (
    <section
      className="relative w-full py-3 xs:py-4 overflow-hidden bg-white border-y border-gray-200"
      aria-label="Promotional announcements"
      role="region"
    >
      {/* Gradient overlays for smooth fade effect - Mobile optimized */}
      <div className="absolute left-0 top-0 bottom-0 w-12 xs:w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 xs:w-16 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Scrolling container - Pure CSS Animation */}
      <div className="relative flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Render messages twice for seamless loop */}
          {[...messages, ...messages].map((message, index) => (
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

// Memo with comparison function
export default memo(ScrollingBanner, (prevProps, nextProps) => {
  if (!prevProps || !nextProps) return false;
  return prevProps.messages === nextProps.messages;
});
