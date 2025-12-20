/**
 * Draft Recovery System
 * Handles loading and applying saved drafts to domain stores
 */

import type { ProductDraft } from '../core/product.types';
import { useBasicInfoStore } from '../basic-info/basic-info.store';
import { usePricingStore } from '../pricing/pricing.store';
import { useInventoryStore } from '../inventory/inventory.store';
import { useVariantsStore } from '../variants/variants.store';
import { useMediaStore } from '../media/media.store';
import { useSEOStore } from '../seo/seo.store';
import { useOrganizationStore } from '../organization/organization.store';
import { loadDraftFromLocalStorage, clearDraftFromLocalStorage } from './autosave.service';

// ============================================================================
// HYDRATE STORES FROM DRAFT
// ============================================================================

export const hydrateStoresFromDraft = (draft: ProductDraft): void => {
    const { data } = draft;

    // Basic Info
    useBasicInfoStore.setState({
        name: data.name,
        description: data.description,
        productType: data.productType,
        category: data.category,
        isDirty: false,
    });

    // Pricing
    usePricingStore.setState({
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        costPerItem: data.costPerItem,
        currency: data.currency,
        taxable: data.taxable,
        isDirty: false,
    });

    // Inventory
    useInventoryStore.setState({
        mode: data.inventoryMode,
        trackInventory: data.trackInventory,
        stock: data.stock,
        sku: data.sku,
        continueSellingWhenOutOfStock: data.continueSellingWhenOutOfStock,
        lowStockThreshold: data.lowStockThreshold,
        isDirty: false,
    });

    // Variants
    useVariantsStore.setState({
        enabled: data.hasVariants,
        variants: data.variants,
        order: data.variantOrder,
        isDirty: false,
    });

    // Media
    useMediaStore.setState({
        images: data.images,
        order: data.imageOrder,
        primaryImageId: data.primaryImageId,
        isDirty: false,
    });

    // SEO
    useSEOStore.setState({
        slug: data.slug,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
        isDirty: false,
    });

    // Organization
    useOrganizationStore.setState({
        status: data.status,
        isFeatured: data.isFeatured,
        collections: data.collections,
        isDirty: false,
    });
};

// ============================================================================
// ATTEMPT DRAFT RECOVERY
// ============================================================================

export const attemptDraftRecovery = (): ProductDraft | null => {
    const draft = loadDraftFromLocalStorage();
    if (!draft) return null;

    hydrateStoresFromDraft(draft);
    return draft;
};

// ============================================================================
// DISCARD DRAFT
// ============================================================================

export const discardDraft = (): void => {
    clearDraftFromLocalStorage();

    // Reset all stores
    useBasicInfoStore.getState().reset();
    usePricingStore.getState().reset();
    useInventoryStore.getState().reset();
    useVariantsStore.getState().reset();
    useMediaStore.getState().reset();
    useSEOStore.getState().reset();
    useOrganizationStore.getState().reset();
};
