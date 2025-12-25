/**
 * Hero Utility Functions
 */

/**
 * Determines if a slide should be visible based on current state
 */
export function isSlideVisible(
    index: number,
    currentIndex: number,
    videoHasPlayed: boolean,
    totalSlides: number
): boolean {
    const isCurrentSlide = index === currentIndex;
    const isNextSlide = index === (currentIndex + 1) % totalSlides;
    const isVideoNotPlayed = !videoHasPlayed;

    return isCurrentSlide || isNextSlide || isVideoNotPlayed;
}

/**
 * Gets content positioning classes based on slide index
 */
export function getSlideContentClasses(index: number): string {
    const baseClasses = "max-w-2xl";
    const marginClasses: Record<number, string> = {
        1: "mt-16 sm:mt-12 md:mt-8 lg:mt-0",
        2: "mt-8 sm:mt-4 md:mt-0 lg:-mt-8",
    };

    const defaultMargin = "mt-32 sm:mt-24 md:mt-16 lg:mt-0";
    return `${baseClasses} ${marginClasses[index] || defaultMargin}`;
}
