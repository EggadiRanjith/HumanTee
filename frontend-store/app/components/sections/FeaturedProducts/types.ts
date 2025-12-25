/**
 * FeaturedProducts Type Definitions
 */

import { Product } from '@/app/types/product.types';

export interface FeaturedSettings {
    enabled: boolean;
    title: string;
    subtitle: string;
    actionText: string;
    actionHref: string;
    limit: number;
    showViewAll: boolean;
}

export interface FeaturedProductsProps {
    // Future: Could accept override props
    products?: Product[];
    settings?: Partial<FeaturedSettings>;
}
