/**
 * Reviews Section
 * Displays customer reviews in a continuous smooth floating container
 * Auto-floats with rewind and pause-on-touch functionality
 */

"use client";

import { useRef, useEffect, useState } from "react";
import { ReviewCard } from '@/app/components/ui/cards';
import { SectionHeader } from '@/app/components/ui/layout';
import { customerReviews } from '@/app/data/reviews.data';


export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Duplicate reviews twice to ensure full width coverage
  const duplicated = [...customerReviews, ...customerReviews];

  // Animation Loop
  const animate = () => {
    if (scrollRef.current && !isPaused && !isUserInteracting) {
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Check if we are at the end to rewind
      if (container.scrollLeft >= maxScroll - 2) {
        // Trigger smooth rewind
        setIsUserInteracting(true); // Pause updates while rewinding
        container.scrollTo({ left: 0, behavior: 'smooth' });

        // Wait for rewind to likely finish then resume
        setTimeout(() => {
          setIsUserInteracting(false);
        }, 1500);
      } else {
        // Continuous float
        container.scrollLeft += 1; // 1px per frame (approx 60px/sec at 60fps)
      }
    }

    // Loop
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Start animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, isUserInteracting]);

  // Handle user interaction - pause and resume after 4 seconds
  const handleUserInteraction = () => {
    setIsUserInteracting(true);

    // Clear existing pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Resume after 4 seconds of no interaction
    pauseTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 4000) as any;
  };

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 sm:px-6 lg:px-10"
      aria-label="Customer Reviews"
    >
      {/* Section Header */}
      <div className="px-4 sm:px-0">
        <SectionHeader
          title="What Our Customers Say"
          variant="centered"
        />
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="
          overflow-x-auto 
          cursor-grab active:cursor-grabbing
          pb-4 no-scrollbar
          w-full
          px-4 sm:px-0
        "
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
        onWheel={(e) => {
          handleUserInteraction();
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
          }
        }}
        onTouchStart={handleUserInteraction}
        onTouchMove={handleUserInteraction}
        onMouseDown={handleUserInteraction}
        onScroll={() => {
          // Optional: logic if needed
        }}
        role="region"
        aria-label="Customer testimonials"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `
        }} />

        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {duplicated.map((review, index) => (
            <ReviewCard
              key={`review-${index}`}
              review={review}
              // Mobile: 85vw width so hints of next card show (don't feel cut off)
              // Desktop: Standard fixed widths
              className="w-[85vw] sm:w-auto shrink-0 !min-w-[auto] sm:!min-w-[300px] md:!min-w-[360px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
