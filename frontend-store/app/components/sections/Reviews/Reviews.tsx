/**
 * Reviews Section
 * Displays customer reviews in a continuous smooth floating container
 * Refactored with API integration, modular hooks, and proper states
 */

"use client";

import { useRef, useState, useEffect, memo, Suspense, lazy } from "react";
import { ReviewCard } from "@/app/components/ui/cards";
import { SectionHeader } from "@/app/components/ui/layout";
import { ReviewsSkeleton } from "./components";
import { useReviewsSettings } from "./hooks/useReviewsSettings";
import { useReviewsAnimation, useReviewsInteraction } from "./hooks";
import { Review } from "@/app/types/review.types";
import styles from "./Reviews.module.css";

const ReviewsEmpty = lazy(() => import("./components/ReviewsEmpty"));

interface ReviewsProps {
  reviews?: any;
  enabled?: boolean;
}

function Reviews({ reviews: propReviews, enabled: propEnabled }: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get reviews settings with fallback support
  const { settings: reviewsSettings, isLoading: settingsLoading } = useReviewsSettings();

  // Extract values from settings with prop fallbacks
  const enabled = propEnabled ?? reviewsSettings?.enabled ?? true;
  const reviews = propReviews ?? reviewsSettings?.items ?? [];
  const title = reviewsSettings?.title;

  // User interaction handling
  const { isUserInteracting, handleUserInteraction } = useReviewsInteraction();

  // Animation (auto-scroll)
  useReviewsAnimation(scrollRef, isUserInteracting);

  // Loading state
  useEffect(() => {
    if (!settingsLoading) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [settingsLoading]);

  // Return null if reviews section is disabled
  if (!enabled) return null;

  // Loading state
  if (isLoading) return <ReviewsSkeleton />;

  // Empty state
  if (!reviews || reviews.length === 0) return <ReviewsEmpty />;

  // Duplicate reviews twice to ensure full width coverage
  const duplicated = [...reviews, ...reviews];

  return (
    <section
      className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 lg:px-10"
      aria-label="Customer Reviews"
    >
      {/* Section Header */}
      <div className="px-4 sm:px-0">
        <SectionHeader title={title} variant="centered" />
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className={`overflow-x-auto cursor-grab active:cursor-grabbing pb-4 w-full px-4 sm:px-0 ${styles.noScrollbar}`}
        onWheel={(e) => {
          handleUserInteraction();
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
          }
        }}
        onTouchStart={handleUserInteraction}
        onTouchMove={handleUserInteraction}
        onMouseDown={handleUserInteraction}
        role="region"
        aria-label="Customer testimonials"
      >

        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {duplicated.map((review, index) => (
            <ReviewCard
              key={`review-${index}`}
              review={review}
              className="w-[70vw] max-w-[280px] sm:w-auto shrink-0 !min-w-[auto] sm:!min-w-[300px] md:!min-w-[360px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Memo with comparison function
export default memo(Reviews, (prevProps: ReviewsProps, nextProps: ReviewsProps) => {
  if (!prevProps || !nextProps) return false;
  return prevProps.reviews === nextProps.reviews && prevProps.enabled === nextProps.enabled;
});
