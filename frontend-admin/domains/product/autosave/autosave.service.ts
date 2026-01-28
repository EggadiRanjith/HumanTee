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

// Global flag to disable autosave (e.g., during edit mode)
let autosaveEnabled = true;

export const setAutosaveEnabled = (enabled: boolean): void => {
    autosaveEnabled = enabled;
};

export const isAutosaveEnabled = (): boolean => autosaveEnabled;

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

    console.warn('🔍 DEBUG media.images from store:', media.images);
    console.warn('🔍 DEBUG file properties:', media.images.map(img => ({ id: img.id, hasFile: !!img.file })));

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

    const sanitizedImages = data.images.map((img, index) => ({
        url: img.cloudinaryUrl || img.url,
        order: img.order ?? index,
        isPrimary: index === 0, // First image is primary
    }));

    return {
        ...cleanData,
        images: sanitizedImages,
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

    // CRITICAL: DO NOT autosave images at all!
    // Reason: File objects cannot be serialized, causing uploads to fail
    // Images will only persist when product is explicitly saved
    const sanitizedImages: any[] = []; // Empty - no image autosave

    // Generate UUID compatible with older browsers
    const generateId = () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const draft: ProductDraft = {
        id: generateId(),
        productId: undefined,
        userId,
        schemaVersion: SCHEMA_VERSION,
        data: {
            ...data,
            images: sanitizedImages, // Empty array - images not autosaved
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (error: any) {
        if (error.name === 'QuotaExceededError') {
            console.error('❌ localStorage quota exceeded! Clearing old drafts and retrying...');
            // Clear draft and try again with minimal data
            clearDraftFromLocalStorage();

            // Try one more time with even more minimal data (no images at all)
            const minimalDraft = {
                ...draft,
                data: {
                    ...draft.data,
                    images: [], // Skip images entirely
                }
            };

            try {
                localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(minimalDraft));
                console.warn('⚠️ Saved draft WITHOUT images due to quota limits');
            } catch (retryError) {
                console.error('❌ Failed to save even minimal draft:', retryError);
            }
        } else {
            throw error; // Re-throw non-quota errors
        }
    }
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

export const triggerAutosave = (userId: string, productId?: string): void => {
    // Skip autosave for edit mode - only autosave when creating new products
    if (productId) {
        return;
    }

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
