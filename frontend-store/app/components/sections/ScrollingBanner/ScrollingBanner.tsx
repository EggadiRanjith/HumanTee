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
  if (!messages || messages.length === 0) return null;
  if (isLoading) return <BannerSkeleton />;

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @-webkit-keyframes marquee {
          0% {
            -webkit-transform: translate3d(0, 0, 0);
          }
          100% {
            -webkit-transform: translate3d(-50%, 0, 0);
          }
        }

        .scrolling-banner {
          animation: marquee 50s linear infinite;
          -webkit-animation: marquee 50s linear infinite;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>

      <section
        className="relative w-full py-3 xs:py-4 overflow-hidden bg-white border-y border-gray-200"
        aria-label="Promotional announcements"
        role="region"
      >
        <div className="relative flex items-center">
          <div className="scrolling-banner flex whitespace-nowrap">
            {/* Render messages twice for seamless loop */}
            {[...messages, ...messages].map((message, index) => (
              <div
                key={index}
                className="inline-flex items-center px-6 xs:px-8 text-[11px] xs:text-[12px] uppercase tracking-[0.25em] xs:tracking-[0.3em] text-gray-800 font-light"
              >
                <span className="text-gray-400 mx-2">•</span>
                {message}
                <span className="text-gray-400 mx-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Memo with comparison function
export default memo(ScrollingBanner, (prevProps, nextProps) => {
  if (!prevProps || !nextProps) return false;
  return prevProps.messages === nextProps.messages;
});
