/**
 * ReviewCard Component
 * Customer review card with avatar, rating, and testimonial
 * 
 * @example
 * <ReviewCard review={review} />
 */

"use client";

import { motion } from 'framer-motion';
import { memo } from 'react';
import Image from 'next/image';
import { Review } from '@/app/types/review.types';

interface ReviewCardProps {
    review: Review;
    className?: string;
}

const ReviewCard = ({ review, className = '' }: ReviewCardProps) => {
    return (
        <motion.div
            className={`
        bg-white/5 border border-white/10 backdrop-blur-xl
        rounded-2xl p-4 sm:p-6 md:p-7
        min-w-[260px] sm:min-w-[300px] md:min-w-[360px]
        transition-all duration-300
        ${className}
      `}
        >
            {/* Avatar & User Info */}
            <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 shrink-0">
                    <Image
                        src={review.avatar || "/images/avatar-placeholder.png"}
                        alt={`${review.name} avatar`}
                        fill
                        className="rounded-full border border-white/15 object-cover"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="font-geist text-white font-medium text-[13px]">
                        {review.name}
                    </h3>
                    <p className="font-geist text-white/60 text-[12px]">
                        {review.role}
                    </p>
                </div>
            </div>

            {/* Rating Stars */}
            <div className="flex mb-3" role="img" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                        aria-hidden="true"
                    >
                        ★
                    </span>
                ))}
            </div>

            {/* Review Text - India-tuned: Readable */}
            <p className="font-geist text-white/60 text-[13px] leading-relaxed">
                {review.text}
            </p>
        </motion.div>
    );
};

// Memoize to prevent unnecessary re-renders
export default memo(ReviewCard, (prevProps, nextProps) => {
    return prevProps.review.id === nextProps.review.id;
});
