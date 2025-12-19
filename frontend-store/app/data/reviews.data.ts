/**
 * Customer Reviews Data
 * Centralized reviews and testimonials data
 */

import { Review } from '@/app/types/review.types';

export const customerReviews: Review[] = [
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
        text: "A cinematic shopping experience with unmatched refinement."
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
    },
];
