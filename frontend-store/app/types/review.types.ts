/**
 * Review and testimonial type definitions
 * Used for customer reviews and ratings
 */

export interface Review {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    text: string;
}

export interface Rating {
    score: number;
    maxScore?: number;
}
