/**
 * Reviews Section
 * Displays customer reviews in a horizontal scrollable container
 * Refactored to use reusable components and centralized data
 */

"use client";

import { useRef } from "react";
import { ReviewCard } from '@/app/components/ui/cards';
import { SectionHeader } from '@/app/components/ui/layout';
import { customerReviews } from '@/app/data/reviews.data';


export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Duplicate reviews for seamless scrolling effect
  const duplicated = [...customerReviews, ...customerReviews];

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10"
      aria-label="Customer Reviews"
    >
      {/* Section Header */}
      <SectionHeader
        title="What Our Customers Say"
        variant="centered"
      />

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="
          overflow-x-auto scroll-smooth
          cursor-grab active:cursor-grabbing
          pb-4
        "
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
        onWheel={(e) => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY * 0.7;
          }
        }}
        role="region"
        aria-label="Customer testimonials"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            div[class*="overflow-x-auto"]::-webkit-scrollbar {
              display: none;
            }
          `
        }} />

        <div className="flex gap-6 sm:gap-8 md:gap-10">
          {duplicated.map((review, index) => (
            <ReviewCard key={`review-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
