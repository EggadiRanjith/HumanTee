/**
 * Image Blur Placeholders
 * Provides low-quality blur data URLs for images to prevent layout shift
 */

// Generic blur placeholder (10x10 gray rectangle)
const GENERIC_BLUR = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=';

/**
 * Get blur placeholder for an image
 * In production, these would be generated at build time using plaiceholder or similar
 */
export function getImagePlaceholder(imagePath: string): string {
    // For now, return generic blur for all images
    // TODO: Generate unique blurs for each image at build time
    return GENERIC_BLUR;
}

/**
 * Generate blur data URL from image (for future use)
 * Requires sharp/plaiceholder at build time
 */
export function generateBlurDataURL(imagePath: string): Promise<string> {
    // Placeholder for future implementation
    // Would use plaiceholder library to generate actual blur
    return Promise.resolve(GENERIC_BLUR);
}
