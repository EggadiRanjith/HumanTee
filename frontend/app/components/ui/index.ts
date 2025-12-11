/**
 * UI Components - Main export file
 * 
 * Organized into categories:
 * - primitives: Basic building blocks (Badge, StockIndicator)
 * - cards: Complex card components (ProductCard, ReviewCard)
 * - layout: Layout and structural components (SectionHeader, GradientOverlay)
 * - loaders: Loading states and animations
 */

// Primitives (Homepage + Universal)
export { Badge, StockIndicator } from './primitives';

// Cards (Homepage + Shop)
export { ProductCard, ReviewCard } from './cards';

// Layout (Homepage + Universal)
export { SectionHeader, GradientOverlay } from './layout';

// Loaders (Universal)
export { IntroLoader, Loader, NavigationLoader } from './loaders';

// Legacy exports (remain in ui root)
export { default as EmptyState } from './EmptyState';
export { LaserFlow } from './LaserFlow';

