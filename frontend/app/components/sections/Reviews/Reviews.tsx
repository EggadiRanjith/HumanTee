"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews: Review[] = [
    { id: 1, name: "Alexander Chen", role: "Luxury Fashion Collector", avatar: "https://i.pravatar.cc/150?img=5", rating: 5, text: "The craftsmanship and detail exceeded my expectations. Truly bespoke luxury." },
    { id: 2, name: "Sophia Martinez", role: "Creative Director", avatar: "https://i.pravatar.cc/150?img=32", rating: 5, text: "Modern premium shopping — curated, elegant, and delightful." },
    { id: 3, name: "James Williams", role: "Entrepreneur", avatar: "https://i.pravatar.cc/150?img=12", rating: 5, text: "A cinematic shopping experience with unmatched refinement." },
    { id: 4, name: "Isabella Rossi", role: "Design Consultant", avatar: "https://i.pravatar.cc/150?img=45", rating: 4, text: "The design language is stunning — every detail feels intentional." },
    { id: 5, name: "Oliver Park", role: "Tech Executive", avatar: "https://i.pravatar.cc/150?img=10", rating: 5, text: "An innovative blend of luxury and digital craftsmanship." },
  ];

  const duplicated = [...reviews, ...reviews]; // infinite feel but real scroll edges exist

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10">

      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="font-geist font-semibold text-[26px] sm:text-[32px] md:text-[36px] text-white tracking-wide">
          What Our Customers Say
        </h2>
        <div className="w-24 h-[2px] bg-white/25 mx-auto mt-4 rounded-full" />
      </div>

      {/* SCROLLABLE CONTAINER */}
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
            scrollRef.current.scrollLeft += e.deltaY * 0.7; // smooth horizontal scroll
          }
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            div[class*="overflow-x-auto"]::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
        {/* STATIC (no transform animation) */}
        <div className="flex gap-6 sm:gap-8 md:gap-10">
          {duplicated.map((review, index) => (
            <motion.div
              key={index}
              className="
                bg-white/5 border border-white/10 backdrop-blur-xl
                rounded-2xl p-6 sm:p-7 md:p-8
                min-w-[260px] sm:min-w-[300px] md:min-w-[360px]
                transition-all duration-300
              "
            >
              {/* Avatar */}
              <div className="flex items-center mb-4">
                <img src={review.avatar} className="w-12 h-12 rounded-full border border-white/15" />
                <div className="ml-3">
                  <h3 className="font-geist text-white font-medium text-sm sm:text-base">{review.name}</h3>
                  <p className="font-geist text-white/60 text-xs sm:text-sm">{review.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Text */}
              <p className="font-geist text-white/70 text-sm sm:text-[15px] leading-relaxed">
                {review.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
