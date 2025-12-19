# UI Components Organization

This directory contains all reusable UI components, organized into logical categories for easy discovery and maintenance.

## 📁 Folder Structure

```
ui/
├── primitives/          # Basic building blocks
│   ├── Badge.tsx       # Product badges (sale, new, bestseller)
│   └── StockIndicator.tsx  # Animated stock status indicator
│
├── cards/              # Card components
│   ├── ProductCard.tsx # Complete product card (Homepage, Shop)
│   └── ReviewCard.tsx  # Customer review card (Homepage)
│
├── layout/             # Layout & structural components
│   ├── SectionHeader.tsx    # Section titles with action buttons
│   └── GradientOverlay.tsx  # Decorative gradient backgrounds
│
├── loaders/            # Loading states & animations
│   ├── IntroLoader.tsx      # Homepage intro animation
│   ├── Loader.tsx           # General loading spinner
│   └── NavigationLoader.tsx # Page transition loader
│
├── EmptyState.tsx      # Empty state displays (Universal)
├── LaserFlow.tsx       # Special effects component (Universal)
└── index.ts            # Main export file
```

---

## 🎯 Component Categories

### **Primitives** (`/primitives`)
**Purpose**: Basic, atomic UI elements that can be combined to create more complex components.

**Components**:
- `Badge` - Labels for products (sale, bestseller, new)
- `StockIndicator` - Animated dot with stock count

**Used in**: Homepage, Shop, Product pages

**Import**:
```tsx
import { Badge, StockIndicator } from '@/app/components/ui/primitives';
```

---

### **Cards** (`/cards`)
**Purpose**: Complex card components primarily for e-commerce features.

**Components**:
- `ProductCard` - Full product display with image, badge, pricing, stock
- `ReviewCard` - Customer testimonials with avatar, rating, text

**Used in**: Homepage (Featured Products, Reviews), Shop page

**Import**:
```tsx
import { ProductCard, ReviewCard } from '@/app/components/ui/cards';
```

---

### **Layout** (`/layout`)
**Purpose**: Structural and decorative components for page layout.

**Components**:
- `SectionHeader` - Consistent section titles (default & centered variants)
- `GradientOverlay` - Ambient gradient backgrounds

**Used in**: All sections across the site

**Import**:
```tsx
import { SectionHeader, GradientOverlay } from '@/app/components/ui/layout';
```

---

### **Loaders** (`/loaders`)
**Purpose**: Loading states, animations, and transitions.

**Components**:
- `IntroLoader` - Cinematic homepage intro animation
- `Loader` - General purpose loading spinner
- `NavigationLoader` - Page transition animations

**Used in**: Homepage, Page transitions, Loading states

**Import**:
```tsx
import { IntroLoader, Loader, NavigationLoader } from '@/app/components/ui/loaders';
```

---

## 📦 Usage Guide

### Import from Category
```tsx
// Import specific components from their category
import { ProductCard } from '@/app/components/ui/cards';
import { Badge } from '@/app/components/ui/primitives';
import { SectionHeader } from '@/app/components/ui/layout';
```

### Import from Main Index
```tsx
// Import from main UI index (also works)
import { ProductCard, Badge, SectionHeader } from '@/app/components/ui';
```

### Import Individual Component
```tsx
// Direct import (most specific)
import Badge from '@/app/components/ui/primitives/Badge';
```

---

## 🏷️ Component Tags

### **Homepage Components**
Components created during homepage optimization:
- `Badge` _(primitives)_
- `StockIndicator` _(primitives)_
- `ProductCard` _(cards)_
- `ReviewCard` _(cards)_
- `SectionHeader` _(layout)_
- `GradientOverlay` _(layout)_

### **Universal Components**
Components used across the entire application:
- `EmptyState` (root)
- `LaserFlow` (root)
- All loaders _(loaders)_

---

## 🔍 Finding Components

### By Use Case:
- **Need a badge?** → `primitives/Badge.tsx`
- **Building a product grid?** → `cards/ProductCard.tsx`
- **Adding a section header?** → `layout/SectionHeader.tsx`
- **Creating a review section?** → `cards/ReviewCard.tsx`
- **Adding loading state?** → `loaders/Loader.tsx`
- **Ambient background effect?** → `layout/GradientOverlay.tsx`

### By Page:
- **Homepage**: All categories (primitives, cards, layout, loaders)
- **Shop Page**: primitives, cards, layout
- **Product Page**: primitives, layout
- **Other Pages**: layout, loaders, EmptyState

---

## 📝 Best Practices

1. **Use Category Imports**: Import from category folders for better organization
2. **Check Existing Components**: Before creating new components, check if a suitable one exists
3. **Follow the Structure**: Place new components in the appropriate category folder
4. **Update Index Files**: Add new components to category and main index files
5. **Document Usage**: Add JSDoc comments explaining component usage

---

## 🆕 Adding New Components

1. **Choose Category**: Determine which category fits your component
2. **Create Component**: Add new file in the appropriate folder
3. **Export from Category**: Update category `index.ts`
4. **Export from Main**: Update main `ui/index.ts`
5. **Add to README**: Update this README with component info

---

## 📚 Documentation

For detailed component API documentation, see:
- **Component Library Docs**: `/COMPONENT_LIBRARY.md` (root of frontend)
- **Individual Components**: JSDoc comments in each component file

---

**Last Updated**: December 11, 2025  
**Components**: 11 total (6 homepage, 5 universal)
