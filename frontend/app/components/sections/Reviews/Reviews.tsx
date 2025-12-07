"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

const Reviews = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollControls = useAnimationControls();

  const reviews: Review[] = [
    {
      id: 1,
      name: "Alexander Chen",
      role: "Luxury Fashion Collector",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "The craftsmanship and detail exceeded my expectations. Truly bespoke luxury."
    },
    {
      id: 2,
      name: "Sophia Martinez",
      role: "Creative Director",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 5,
      text: "Modern premium shopping — curated, elegant, and delightful."
    },
    {
      id: 3,
      name: "James Williams",
      role: "Entrepreneur",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      text: "Cinematic shopping experience with unmatched refinement."
    },
    {
      id: 4,
      name: "Isabella Rossi",
      role: "Design Consultant",
      avatar: "https://i.pravatar.cc/150?img=45",
      rating: 4,
      text: "The design language is stunning — every detail feels intentional."
    },
    {
      id: 5,
      name: "Oliver Park",
      role: "Tech Executive",
      avatar: "https://i.pravatar.cc/150?img=10",
      rating: 5,
      text: "An innovative blend of luxury and digital craftsmanship."
    }
  ];

  const doubled = [...reviews, ...reviews];

  useEffect(() => {
    scrollControls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: 22,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, []);

  return (
    <section className="py-24 px-6 cinematic-bg-oblivion relative overflow-hidden">

      {/* Aurora background */}
      <motion.div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: "var(--gradient-aurora)" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ========================= TITLE (NO ANIMATION) ========================= */}
        <div className="text-center mb-16">
          <h2
            className="
              font-geist 
              brand-text-primary
              text-step-4 sm:text-step-5 md:text-step-6 lg:text-step-7
              font-heading tracking-wide
            "
          >
            What Our Customers Say
          </h2>

          <div className="mx-auto mt-4 h-[2px] w-32 bg-brand-secondary/30 rounded-full" />
        </div>

        {/* ========================= AUTO SCROLL REVIEWS ========================= */}
        <div className="overflow-hidden w-full">
          <motion.div
            className="flex gap-8"
            animate={scrollControls}
            onMouseEnter={() => scrollControls.stop()}
            onMouseLeave={() =>
              scrollControls.start({
                x: ["0%", "-50%"],
                transition: {
                  duration: 22,
                  repeat: Infinity,
                  ease: "linear",
                },
              })
            }
          >
            {doubled.map((review, index) => {
              const isFocused = hoveredId === review.id;

              return (
                <motion.div
                  key={index}
                  className="
                    luxury-glass 
                    min-w-[260px] sm:min-w-[300px] md:min-w-[360px] lg:min-w-[400px]
                    rounded-2xl p-6 sm:p-7 md:p-8
                    border border-white/10 backdrop-blur-xl shadow-glow-violet
                    transition-all duration-300 relative
                  "
                  onMouseEnter={() => setHoveredId(review.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  animate={{
                    scale: isFocused ? 1.08 : 1,
                    filter:
                      hoveredId && !isFocused
                        ? "blur(4px) brightness(0.4)"
                        : "none",
                  }}
                >
                  {/* Glow highlight */}
                  <motion.div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, var(--accent-violet), transparent)",
                    }}
                    animate={{ opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />

                  {/* Avatar */}
                  <div className="flex items-center mb-3">
                    <img
                      src={review.avatar}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20"
                    />
                    <div className="ml-3">
                      <h3 className="font-heading text-step-0 sm:text-step-1 brand-text-primary">
                        {review.name}
                      </h3>
                      <p className="text-xs sm:text-sm brand-text-muted">
                        {review.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base sm:text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="brand-text-muted text-sm sm:text-base leading-relaxed">
                    {review.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
