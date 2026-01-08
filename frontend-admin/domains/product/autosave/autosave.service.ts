/**
 * Autosave Service
 * Observes domain stores and triggers debounced saves
 * 
 * CRITICAL: Autosave is an OBSERVER, not an owner
 * - Watches domain dirty flags
 * - Debounces saves (5-10 seconds)
 * - Never stores domain data itself
 */

import { useBasicInfoStore } from '../basic-info/basic-info.store';
import { usePricingStore } from '../pricing/pricing.store';
import { useInventoryStore } from '../inventory/inventory.store';
import { useVariantsStore } from '../variants/variants.store';
import { useMediaStore } from '../media/media.store';
import { useOrganizationStore } from '../organization/organization.store';
import type { ProductFormData, ProductDraft } from '../core/product.types';
import { SCHEMA_VERSION } from '../core/product.types';

// ============================================================================
// AUTOSAVE CONFIGURATION
// ============================================================================

const AUTOSAVE_DEBOUNCE_MS = 8000; // 8 seconds
const DRAFT_STORAGE_KEY = 'product_draft';

// ============================================================================
// DIRTY STATE OBSERVER
// ============================================================================

export const observeHasUnsavedChanges = (): boolean => {
    return (
        useBasicInfoStore.getState().isDirty ||
        usePricingStore.getState().isDirty ||
        useInventoryStore.getState().isDirty ||
        useVariantsStore.getState().isDirty ||
        useMediaStore.getState().isDirty ||
        useOrganizationStore.getState().isDirty
    );
};

// ============================================================================
// AGGREGATE PRODUCT DATA
// ============================================================================

export const aggregateProductData = (): ProductFormData => {
    const basicInfo = useBasicInfoStore.getState();
    const pricing = usePricingStore.getState();
    const inventory = useInventoryStore.getState();
    const variants = useVariantsStore.getState();
    const media = useMediaStore.getState();
    const organization = useOrganizationStore.getState();

    return {
        // Basic Info
        name: basicInfo.name,
        description: basicInfo.description,
        productType: basicInfo.productType,
        category: basicInfo.category,

        // Media
        images: media.images,

        // SEO
        slug: basicInfo.name.toLowerCase().replace(/\s+/g, '-'),

        // Pricing
        price: pricing.price,
        compareAtPrice: pricing.compareAtPrice,
        costPerItem: pricing.costPerItem,
        currency: pricing.currency,
        taxable: pricing.taxable,

        // Variants
        hasVariants: variants.enabled,
        variants: variants.variants,

        // Inventory
        inventoryMode: inventory.mode,
        trackInventory: inventory.trackInventory,
        stock: inventory.stock,
        sku: inventory.sku,
        continueSellingWhenOutOfStock: inventory.continueSellingWhenOutOfStock,
        lowStockThreshold: inventory.lowStockThreshold,

        // Organization
        status: organization.status,
        isFeatured: organization.isFeatured,
        collections: organization.collections,

        // Metadata
        version: 0,
        updatedAt: new Date(),
    };
};

// ============================================================================
// SANITIZE DATA FOR API
// ============================================================================

/**
 * Sanitizes product data for API submission by removing frontend-only fields
 * Backend will generate these fields automatically
 */
export const sanitizeProductDataForAPI = (data: ProductFormData): any => {
    const { slug, version, updatedAt, ...cleanData } = data;

    return {
        ...cleanData,
        // Sanitize images - remove frontend metadata and map to backend schema
        images: data.images.map((img, index) => ({
            url: img.url,
            order: img.position ?? index,
            isPrimary: index === 0, // First image is primary
        })),
        // Sanitize variants - remove frontend IDs and metadata
        variants: data.variants.map(({ id, skuLocked, ...variant }) => variant),
    };
};

// ============================================================================
// MARK ALL CLEAN
// ============================================================================

export const markAllDomainsClean = (): void => {
    useBasicInfoStore.getState().markClean();
    usePricingStore.getState().markClean();
    useInventoryStore.getState().markClean();
    useVariantsStore.getState().markClean();
    useMediaStore.getState().markClean();
    useOrganizationStore.getState().markClean();
};

// ============================================================================
// DRAFT SAVE/LOAD (LocalStorage)
// ============================================================================

export const saveDraftToLocalStorage = (userId: string): void => {
    const data = aggregateProductData();

    const draft: ProductDraft = {
        id: crypto.randomUUID(),
        productId: undefined,
        userId,
        schemaVersion: SCHEMA_VERSION,
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
};

export const loadDraftFromLocalStorage = (): ProductDraft | null => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return null;

    try {
        const draft = JSON.parse(stored) as ProductDraft;

        // Check schema version
        if (draft.schemaVersion !== SCHEMA_VERSION) {
            console.warn('Draft schema version mismatch. Migration needed.');
            // TODO: Implement schema migration
            return null;
        }

        return draft;
    } catch (error) {
        console.error('Failed to load draft:', error);
        return null;
    }
};

export const clearDraftFromLocalStorage = (): void => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
};

// ============================================================================
// DEBOUNCED AUTOSAVE
// ============================================================================

let autosaveTimeout: number | null = null;

export const triggerAutosave = (userId: string): void => {
    if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
    }

    autosaveTimeout = window.setTimeout(() => {
        if (observeHasUnsavedChanges()) {
            saveDraftToLocalStorage(userId);
            console.log('✅ Draft autosaved');
        }
    }, AUTOSAVE_DEBOUNCE_MS);
};

export const cancelAutosave = (): void => {
    if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = null;
    }
};
