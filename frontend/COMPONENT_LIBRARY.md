# HumanTee Component Library

Professional, reusable UI components extracted from the homepage for universal usage across the application.

---

## 🎨 UI Components

### Badge
Universal badge component for product labels and status indicators.

**Location**: `app/components/ui/Badge.tsx`

**Props**:
- `variant`: `'sale' | 'bestseller' | 'new'` - Badge style variant
- `label?`: `string` - Custom label text (optional, defaults to variant label)
- `className?`: `string` - Additional CSS classes

**Usage**:
```tsx
import Badge from '@/app/components/ui/Badge';

<Badge variant="sale" />
<Badge variant="bestseller" label="Custom Text" />
```

---

### StockIndicator
Animated stock status indicator with pulse effect and color-coded levels.

**Location**: `app/components/ui/StockIndicator.tsx`

**Props**:
- `stock`: `number` - Stock quantity
- `showCount?`: `boolean` - Show stock count text (default: true)
- `size?`: `'sm' | 'md' | 'lg'` - Indicator size (default: 'sm')
- `className?`: `string` - Additional CSS classes

**Stock Levels**:
- **Low Stock**: ≤ 3 items (red)
- **Limited Stock**: 4-8 items (amber)
- **In Stock**: > 8 items (green)

**Usage**:
```tsx
import StockIndicator from '@/app/components/ui/StockIndicator';

<StockIndicator stock={5} />
<StockIndicator stock={10} showCount={false} size="md" />
```

---

### ProductCard
Complete product card with image, badge, quick view overlay, and pricing.

**Location**: `app/components/ui/ProductCard.tsx`

**Props**:
- `product`: `Product` - Product data object
- `onQuickView?`: `(productId: number) => void` - Quick view callback
- `priority?`: `boolean` - Prioritize image loading (default: false)
- `className?`: `string` - Additional CSS classes

**Product Type**:
```typescript
interface Product {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: BadgeVariant;
  stock: number;
}
```

**Usage**:
```tsx
import ProductCard from '@/app/components/ui/ProductCard';

<ProductCard 
  product={productData} 
  onQuickView={(id) => console.log('Quick view:', id)}
  priority={true}
/>
```

**Features**:
- Hover scale animation
- Desktop-only quick view overlay
- Automatic badge display
- Stock indicator
- Price with optional strikethrough

---

### ReviewCard
Customer review card with avatar, star rating, and testimonial.

**Location**: `app/components/ui/ReviewCard.tsx`

**Props**:
- `review`: `Review` - Review data object
- `className?`: `string` - Additional CSS classes

**Review Type**:
```typescript
interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}
```

**Usage**:
```tsx
import ReviewCard from '@/app/components/ui/ReviewCard';

<ReviewCard review={reviewData} />
```

**Features**:
- Glass morphism effect
- 5-star rating display
- Responsive sizing
- Accessible rating labels

---

### SectionHeader
Reusable section header with title and optional action button.

**Location**: `app/components/ui/SectionHeader.tsx`

**Props**:
- `title`: `string` - Section title
- `actionText?`: `string` - Action button text
- `actionHref?`: `string` - Action button link
- `variant?`: `'default' | 'centered'` - Header layout (default: 'default')
- `className?`: `string` - Additional CSS classes

**Usage**:
```tsx
import SectionHeader from '@/app/components/ui/SectionHeader';

// Default variant with action
<SectionHeader 
  title="Featured Products" 
  actionText="View All" 
  actionHref="/shop" 
/>

// Centered variant
<SectionHeader 
  title="Customer Reviews" 
  variant="centered" 
/>
```

**Variants**:
- **Default**: Left-aligned title with right-aligned action button
- **Centered**: Centered title with decorative underline

---

### GradientOverlay
Decorative gradient overlay for ambient background effects.

**Location**: `app/components/ui/GradientOverlay.tsx`

**Props**:
- `variant?`: `'aurora' | 'violet' | 'cyan' | 'custom'` - Gradient style (default: 'aurora')
- `opacity?`: `number` - Overlay opacity (default: 0.4)
- `position?`: `string` - Gradient position (default: '50% 10%')
- `blur?`: `number` - Blur amount in pixels (default: 120)
- `customGradient?`: `string` - Custom CSS gradient (required when variant='custom')
- `className?`: `string` - Additional CSS classes

**Usage**:
```tsx
import GradientOverlay from '@/app/components/ui/GradientOverlay';

<GradientOverlay variant="aurora" />
<GradientOverlay variant="violet" opacity={0.3} blur={80} />
<GradientOverlay 
  variant="custom" 
  customGradient="radial-gradient(circle, rgba(255,0,0,0.2), transparent)" 
/>
```

---

## 📦 Data Organization

All hardcoded data has been extracted to centralized data files for easy management and reusability.

### Products Data
**Location**: `app/data/products.data.ts`

```typescript
import { featuredProducts } from '@/app/data/products.data';
```

### Reviews Data
**Location**: `app/data/reviews.data.ts`

```typescript
import { customerReviews } from '@/app/data/reviews.data';
```

### Banner Messages
**Location**: `app/data/banner-messages.data.ts`

```typescript
import { bannerMessages } from '@/app/data/banner-messages.data';
```

### Hero Slides
**Location**: `app/data/hero-slides.data.ts`

```typescript
import { heroSlides } from '@/app/data/hero-slides.data';
```

---

## 🔧 Constants

Centralized constants for animations, styles, and configuration.

### Animation Constants
**Location**: `app/constants/animations.constants.ts`

```typescript
export const HERO_SLIDE_INTERVAL = 6000;
export const INTRO_DURATION = 3500;
export const SCROLL_ANIMATION_DURATION = 20;
export const TRANSITION_DURATION = 700;
```

### Style Constants
**Location**: `app/constants/styles.constants.ts`

```typescript
export const STOCK_THRESHOLDS = { LOW: 3, LIMITED: 8 };
export const BADGE_STYLES = { ... };
export const BADGE_LABELS = { ... };
```

---

## 📐 Type Definitions

Shared TypeScript types for type safety across components.

### Product Types
**Location**: `app/types/product.types.ts`

```typescript
import { BadgeVariant, Product, StockInfo } from '@/app/types/product.types';
```

### Review Types
**Location**: `app/types/review.types.ts`

```typescript
import { Review, Rating } from '@/app/types/review.types';
```

---

## ✅ Benefits

### Reusability
- Use components anywhere in the application
- Consistent UI across all pages
- Faster development with pre-built components

### Maintainability
- Centralized data management
- Easy to update styles and behavior
- Single source of truth for constants

### Type Safety
- Full TypeScript support
- Autocomplete and IntelliSense
- Compile-time error checking

### Performance
- Optimized components with proper memoization
- Lazy loading support
- Minimal re-renders

### Accessibility
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support

---

## 🚀 Usage Examples

### Building a Product Grid
```tsx
import ProductCard from '@/app/components/ui/ProductCard';
import SectionHeader from '@/app/components/ui/SectionHeader';
import { featuredProducts } from '@/app/data/products.data';

function ProductGrid() {
  return (
    <section>
      <SectionHeader 
        title="New Arrivals" 
        actionText="View All" 
        actionHref="/products" 
      />
      <div className="grid grid-cols-3 gap-6">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

### Building a Reviews Section
```tsx
import ReviewCard from '@/app/components/ui/ReviewCard';
import SectionHeader from '@/app/components/ui/SectionHeader';
import { customerReviews } from '@/app/data/reviews.data';

function ReviewsSection() {
  return (
    <section>
      <SectionHeader title="Customer Reviews" variant="centered" />
      <div className="flex gap-6 overflow-x-auto">
        {customerReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
```

---

## 📝 Notes

- All components are fully typed with TypeScript
- Components follow React best practices
- Accessible by default (ARIA labels, semantic HTML)
- Responsive design built-in
- Performance optimized with proper React patterns

For questions or issues, refer to the individual component files for detailed JSDoc comments.
