/**
 * Product Creation Page (PRODUCTION-GRADE)
 * Uses domain stores for state management
 * Full-featured with all 7 tabs, autosave, and mobile responsiveness
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { TabKey } from '@/types/product-form.types';
import TabNavigation from '../components/TabNavigation';
import BasicInfoTab from '../components/tabs/BasicInfoTab';
import MediaTab from '../components/tabs/MediaTab';
import PricingTab from '../components/tabs/PricingTab';
import VariantsTab from '../components/tabs/VariantsTab';
import InventoryTab from '../components/tabs/InventoryTab';
import OrganizationTab from '../components/tabs/OrganizationTab';
import MobileProductWizard from '../components/MobileProductWizard';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { useMediaStore } from '@/domains/product/media/media.store';
import { usePricingStore } from '@/domains/product/pricing/pricing.store';
import { useInventoryStore } from '@/domains/product/inventory/inventory.store';
import { useVariantsStore } from '@/domains/product/variants/variants.store';
import { useOrganizationStore } from '@/domains/product/organization/organization.store';
import { observeHasUnsavedChanges, aggregateProductData, markAllDomainsClean } from '@/domains/product/autosave/autosave.service';
import { attemptDraftRecovery, discardDraft } from '@/domains/product/autosave/draft.recovery';
import { ConfirmActionModal } from '@/app/admin/components/ConfirmActionModal';
import { UploadProgressModal } from '@/app/components/UploadProgressModal';
import { useImageUploads } from '@/app/hooks/useImageUploads';
import { toast } from 'sonner';

export default function NewProductPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>('basic');
    const [isSaving, setIsSaving] = useState(false);
    const [showDraftRecovery, setShowDraftRecovery] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Image upload hook for deferred uploads
    const { uploadItems, isUploading, uploadPendingImages, resetUploads } = useImageUploads();

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset all stores on mount to prevent state pollution from previous edits
    useEffect(() => {
        useBasicInfoStore.getState().reset();
        useMediaStore.getState().reset();
        usePricingStore.getState().reset();
        useInventoryStore.getState().reset();
        useVariantsStore.getState().reset();
        useOrganizationStore.getState().reset();
        markAllDomainsClean();
    }, []);

    // Get state from stores for validation
    const { name } = useBasicInfoStore();
    const { price } = usePricingStore();

    // Validation errors for inline display
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        description?: string;
        productType?: string;
        category?: string;
        price?: string;
        images?: string;
        variants?: string;
    }>({});

    // Wizard state management
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    // Step definitions
    const wizardSteps = [
        { key: 'basic' as TabKey, label: 'Basic Info', index: 0 },
        { key: 'media' as TabKey, label: 'Media', index: 1 },
        { key: 'pricing' as TabKey, label: 'Pricing', index: 2 },
        { key: 'variants' as TabKey, label: 'Variants', index: 3 },
        { key: 'inventory' as TabKey, label: 'Inventory', index: 4 },
        { key: 'organization' as TabKey, label: 'Organization', index: 5 },
    ];

    // Sync activeTab with currentStep
    useEffect(() => {
        setActiveTab(wizardSteps[currentStep].key);
    }, [currentStep]);

    // Attempt draft recovery on mount
    useEffect(() => {
        const draft = attemptDraftRecovery();
        if (draft) {
            setShowDraftRecovery(true);
        }
    }, []);

    // Clear specific errors when fields change (real-time validation)
    useEffect(() => {
        if (validationErrors.name && name) {
            setValidationErrors(prev => ({ ...prev, name: undefined }));
        }
    }, [name, validationErrors.name]);

    const { description, productType, category } = useBasicInfoStore();

    useEffect(() => {
        if (validationErrors.description && description) {
            setValidationErrors(prev => ({ ...prev, description: undefined }));
        }
    }, [description, validationErrors.description]);

    useEffect(() => {
        if (validationErrors.productType && productType) {
            setValidationErrors(prev => ({ ...prev, productType: undefined }));
        }
    }, [productType, validationErrors.productType]);

    useEffect(() => {
        if (validationErrors.category && category) {
            setValidationErrors(prev => ({ ...prev, category: undefined }));
        }
    }, [category, validationErrors.category]);

    const { enabled: variantsEnabled, variants } = useVariantsStore();

    useEffect(() => {
        if (validationErrors.variants && variantsEnabled && variants.length > 0) {
            const allValid = variants.every(v => v.size && v.sku);
            if (allValid) {
                setValidationErrors(prev => ({ ...prev, variants: undefined }));
            }
        }
    }, [variants, variantsEnabled, validationErrors.variants]);

    // Get additional state for error detection

    // Tab configuration with comprehensive error detection
    const tabs = [
        {
            key: 'basic' as TabKey,
            label: 'Basic Info',
            icon: '📝',
            hasErrors: !name || !description || !productType || !category
        },
        {
            key: 'media' as TabKey,
            label: 'Media',
            icon: '📸',
            hasErrors: false // Will be updated when media store is available
        },
        {
            key: 'pricing' as TabKey,
            label: 'Pricing',
            icon: '💰',
            hasErrors: !price || price <= 0
        },
        {
            key: 'variants' as TabKey,
            label: 'Variants',
            icon: '🎨',
            hasErrors: !variantsEnabled || !variants || variants.length === 0
        },
        {
            key: 'inventory' as TabKey,
            label: 'Inventory',
            icon: '📦',
            hasErrors: false
        },
        {
            key: 'organization' as TabKey,
            label: 'Organization',
            icon: '🏷️',
            hasErrors: false
        },
    ];

    const handleSaveDraft = async () => {
        if (!name) {
            toast.error('Product name is required to save a draft');
            setActiveTab('basic');
            return;
        }

        setIsSaving(true);
        try {
            const productData = aggregateProductData();

            // Upload pending images first (shows progress modal)
            const imagesWithCloudinaryUrls = await uploadPendingImages(productData.images);

            // Transform data for backend strictly
            const draftRequest = {
                name: productData.name,
                description: productData.description || '',
                productType: productData.productType,
                category: productData.category,
                price: Number(productData.price) || 0,
                compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
                costPerItem: productData.costPerItem ? Number(productData.costPerItem) : undefined,
                currency: productData.currency || 'INR',
                taxable: productData.taxable ?? true,

                // Media - Use Cloudinary URLs (already uploaded above)
                images: imagesWithCloudinaryUrls.map(img => ({
                    url: img.cloudinaryUrl || img.url,
                    altText: img.altText || '',
                    isPrimary: img.isPrimary,
                    order: img.order,
                })),

                // Variants
                hasVariants: productData.hasVariants,
                inventoryMode: (productData.hasVariants ? 'VARIANT' : 'SINGLE') as any,
                variants: productData.hasVariants ? productData.variants.map(v => ({
                    size: v.size,
                    sku: v.sku || '',
                    stock: Number(v.stock) || 0,
                    priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
                })) : [],

                // Inventory
                trackInventory: productData.trackInventory,
                stock: !productData.hasVariants ? (Number(productData.stock) || 0) : undefined,
                sku: !productData.hasVariants ? (productData.sku || undefined) : undefined,
                continueSellingWhenOutOfStock: productData.continueSellingWhenOutOfStock,
                lowStockThreshold: productData.lowStockThreshold ? Number(productData.lowStockThreshold) : undefined,

                // Organization - Force DRAFT
                status: 'DRAFT',
                isFeatured: productData.isFeatured,
                collections: productData.collections || [],
            };

            // Threshold Validation
            const totalStockCount = draftRequest.hasVariants
                ? draftRequest.variants.reduce((sum: number, v) => sum + v.stock, 0)
                : (draftRequest.stock || 0);

            if (draftRequest.lowStockThreshold && draftRequest.lowStockThreshold > totalStockCount) {
                toast.error(`Low stock threshold (${draftRequest.lowStockThreshold}) cannot exceed total stock (${totalStockCount})`);
                return;
            }

            const { createProduct } = await import('@/lib/api/products');
            const created = await createProduct(draftRequest as any);

            markAllDomainsClean();
            discardDraft();

            toast.success('Draft saved to database!');
            router.push(`/admin/products/${created.id}`);
        } catch (error) {
            // Failed to save draft
            toast.error(error instanceof Error ? error.message : 'Failed to save draft');
        } finally {
            setIsSaving(false);
        }
    };

    // Step validation functions
    const validateBasicInfo = (): boolean => {
        const errors: typeof validationErrors = {};

        if (!name || name.trim() === '') {
            errors.name = 'Product name is required';
        }
        if (!description || description.trim() === '') {
            errors.description = 'Product description is required';
        }
        if (!productType || productType.trim() === '') {
            errors.productType = 'Product type is required';
        }
        if (!category || category.trim() === '') {
            errors.category = 'Product category is required';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
        }
        setValidationErrors({});
        return true;
    };

    const validateMedia = (): boolean => {
        const productData = aggregateProductData();
        if (!productData.images || productData.images.length === 0) {
            setValidationErrors({ images: 'At least one product image is required' });
            return false;
        }
        setValidationErrors({});
        return true;
    };

    const validatePricing = (): boolean => {
        if (!price || price <= 0) {
            setValidationErrors({ price: 'Valid price is required' });
            return false;
        }
        setValidationErrors({});
        return true;
    };

    const validateVariants = (): boolean => {
        const productData = aggregateProductData();

        // Validating Variants

        if (!productData.hasVariants || !productData.variants || productData.variants.length === 0) {
            // Show error message for variants
            setValidationErrors({ variants: 'Please add at least one product variant with size and SKU' });
            return false;
        }
        const invalidVariant = productData.variants.find(v => !v.size || !v.sku);
        if (invalidVariant) {
            setValidationErrors({ variants: 'All variants must have a size and SKU' });
            return false;
        }
        return true;
    };

    // Wizard navigation handlers
    const handleContinue = () => {
        let isValid = false;

        switch (currentStep) {
            case 0: isValid = validateBasicInfo(); break;
            case 1: isValid = validateMedia(); break;
            case 2: isValid = validatePricing(); break;
            case 3: isValid = validateVariants(); break;
            case 4: isValid = true; break; // Inventory optional
            case 5: isValid = true; break; // Organization optional
        }

        if (isValid) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            setValidationErrors({});
            if (currentStep < wizardSteps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setValidationErrors({});
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePublish = async () => {
        // Step-by-step validation - validate each section completely before moving to next
        const productData = aggregateProductData();

        // STEP 1: Basic Info - ALL REQUIRED
        const basicInfoErrors: typeof validationErrors = {};

        if (!name) {
            basicInfoErrors.name = 'Product name is required';
        }
        if (!productData.description || productData.description.trim() === '') {
            basicInfoErrors.description = 'Product description is required';
        }
        if (!productData.productType) {
            basicInfoErrors.productType = 'Product type is required';
        }
        if (!productData.category) {
            basicInfoErrors.category = 'Product category is required';
        }

        // If Basic Info has errors, show them and stop
        if (Object.keys(basicInfoErrors).length > 0) {
            setValidationErrors(basicInfoErrors);
            setActiveTab('basic');
            return;
        }

        // STEP 2: Media - At least 1 image required
        if (!productData.images || productData.images.length === 0) {
            setValidationErrors({ images: 'At least one product image is required' });
            setActiveTab('media');
            return;
        }

        // STEP 3: Pricing - Valid price required
        if (!price || price <= 0) {
            setValidationErrors({ price: 'Valid price is required' });
            setActiveTab('pricing');
            return;
        }

        // STEP 4: Variants - REQUIRED (must have at least 1 variant with size)
        if (!productData.hasVariants || !productData.variants || productData.variants.length === 0) {
            setValidationErrors({});
            setActiveTab('variants');
            return;
        }

        // STEP 5: Validate each variant has size and SKU
        const invalidVariant = productData.variants.find(v => !v.size || !v.sku);
        if (invalidVariant) {
            setValidationErrors({});
            setActiveTab('variants');
            return;
        }

        // All validation passed - clear errors and proceed
        setValidationErrors({});

        setIsSaving(true);
        try {
            const productData = aggregateProductData();

            // STEP 1: Upload all pending images (shows progress modal)
            const imagesWithCloudinaryUrls = await uploadPendingImages(productData.images);

            // STEP 2: Prepare image data for backend
            const uploadedImages = imagesWithCloudinaryUrls.map(img => ({
                url: img.cloudinaryUrl || img.url,
                altText: img.altText || '',
                isPrimary: img.isPrimary,
                order: img.order,
            }));



            // Transform data for backend strictly
            const publishRequest = {
                name: productData.name,
                description: productData.description || '',
                productType: productData.productType,
                category: productData.category,
                price: Number(productData.price),
                compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
                costPerItem: productData.costPerItem ? Number(productData.costPerItem) : undefined,
                currency: productData.currency || 'INR',
                taxable: productData.taxable ?? true,

                // Media - Use uploaded Cloudinary URLs
                images: uploadedImages,

                // Variants
                hasVariants: productData.hasVariants,
                inventoryMode: (productData.hasVariants ? 'VARIANT' : 'SINGLE') as any,
                variants: productData.hasVariants ? productData.variants.map(v => ({
                    size: v.size,
                    sku: v.sku || '',
                    stock: Number(v.stock) || 0,
                    priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
                })) : [],

                // Inventory
                trackInventory: productData.trackInventory,
                stock: !productData.hasVariants ? (Number(productData.stock) || 0) : undefined,
                sku: !productData.hasVariants ? (productData.sku || undefined) : undefined,
                continueSellingWhenOutOfStock: productData.continueSellingWhenOutOfStock,
                lowStockThreshold: productData.lowStockThreshold ? Number(productData.lowStockThreshold) : undefined,

                // Organization
                status: 'ACTIVE',
                isFeatured: productData.isFeatured,
                collections: productData.collections || [],
            };

            // Threshold Validation
            const totalStockCount = publishRequest.hasVariants
                ? publishRequest.variants.reduce((sum: number, v) => sum + v.stock, 0)
                : (publishRequest.stock || 0);

            if (publishRequest.lowStockThreshold && publishRequest.lowStockThreshold > totalStockCount) {
                toast.error(`Low stock threshold (${publishRequest.lowStockThreshold}) cannot exceed total stock (${totalStockCount})`);
                return;
            }

            // Call backend API to create product
            const { createProduct } = await import('@/lib/api/products');
            const createdProduct = await createProduct(publishRequest as any);

            // Success! Clear draft and reset all stores
            markAllDomainsClean();
            discardDraft();

            // Reset all domain stores for next product
            useBasicInfoStore.getState().reset();
            useMediaStore.getState().reset();
            usePricingStore.getState().reset();
            useInventoryStore.getState().reset();
            useVariantsStore.getState().reset();
            useOrganizationStore.getState().reset();

            toast.success('Product published successfully!');
            router.push('/admin/products');
        } catch (error: any) {

            // Extract detailed error message from backend
            let errorMessage = 'Failed to publish product';
            if (error.response?.data?.message) {
                // Backend validation error
                if (Array.isArray(error.response.data.message)) {
                    errorMessage = error.response.data.message.join(', ');
                } else {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return <BasicInfoTab errors={validationErrors} />;
            case 'media':
                return <MediaTab errors={{ images: validationErrors.images }} />;
            case 'pricing':
                return <PricingTab errors={{ price: validationErrors.price }} />;
            case 'variants':
                return <VariantsTab errors={{ variants: validationErrors.variants }} />;
            case 'inventory':
                return <InventoryTab />;
            case 'organization':
                return <OrganizationTab />;
            default:
                return <BasicInfoTab />;
        }
    };

    const hasUnsavedChanges = observeHasUnsavedChanges();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Upload Progress Modal - Global overlay */}
            <UploadProgressModal
                isOpen={isUploading}
                items={uploadItems}
                onComplete={resetUploads}
            />
            {/* Draft Recovery Banner - Improved UX - Compact Mobile */}
            {showDraftRecovery && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-3 md:px-4 lg:px-6 py-3 md:py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xs md:text-sm font-semibold text-gray-900">Draft Found</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mt-0.5">
                                        We found an unsaved product from your previous session
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 sm:flex-shrink-0">
                                <button
                                    onClick={() => {
                                        discardDraft();
                                        setShowDraftRecovery(false);
                                    }}
                                    className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Start Fresh
                                </button>
                                <button
                                    onClick={() => setShowDraftRecovery(false)}
                                    className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Continue Editing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile: Show wizard instead of tabs */}
            {isMobile ? (
                <MobileProductWizard />
            ) : (
                <>
                    {/* Header - Sticky - Compact Mobile */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        <div className="max-w-7xl mx-auto">
                            <button
                                onClick={() => router.back()}
                                className="text-xs md:text-sm text-gray-600 hover:text-black mb-2 md:mb-3 inline-flex items-center gap-1"
                            >
                                ← Back to products
                            </button>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 md:gap-3">
                                <div className="flex-1">
                                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-black">
                                        Create New Product
                                    </h1>
                                    {hasUnsavedChanges && (
                                        <p className="text-xs md:text-sm text-orange-600 mt-1 flex items-center gap-1">
                                            <span className="inline-block w-2 h-2 bg-orange-600 rounded-full"></span>
                                            Unsaved changes
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation - Sticky */}
                    <div className="sticky top-[88px] z-10 bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <TabNavigation
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={(newTab) => {
                                    // Get the index of the new tab
                                    const newTabIndex = tabs.findIndex(t => t.key === newTab);
                                    const currentTabIndex = tabs.findIndex(t => t.key === activeTab);

                                    // Allow backward navigation
                                    if (newTabIndex < currentTabIndex) {
                                        setActiveTab(newTab);
                                        return;
                                    }

                                    // For forward navigation, validate current tab first
                                    let isValid = false;
                                    switch (activeTab) {
                                        case 'basic': isValid = validateBasicInfo(); break;
                                        case 'media': isValid = validateMedia(); break;
                                        case 'pricing': isValid = validatePricing(); break;
                                        case 'variants': isValid = validateVariants(); break;
                                        case 'inventory': isValid = true; break; // Optional
                                        case 'organization': isValid = true; break; // Optional
                                    }

                                    if (isValid) {
                                        setActiveTab(newTab);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Tab Content - Compact Mobile */}
                    <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 pb-32">
                        {renderTabContent()}
                    </div>

                    {/* Desktop Footer - Sticky Bottom - Matches Mobile Design */}
                    <div className="hidden sm:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-20 shadow-lg">
                        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <div className="flex gap-3">
                                {/* Back Button - Show on all steps except first */}
                                {currentStep > 0 && (
                                    <button
                                        onClick={handleBack}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                                    >
                                        ← Back
                                    </button>
                                )}

                                {/* Continue Button - Show on all steps except last */}
                                {currentStep < wizardSteps.length - 1 && (
                                    <button
                                        onClick={handleContinue}
                                        className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                                    >
                                        Continue →
                                    </button>
                                )}

                                {/* Save Draft & Publish - Show only on last step */}
                                {currentStep === wizardSteps.length - 1 && (
                                    <>
                                        <button
                                            onClick={handleSaveDraft}
                                            disabled={isSaving}
                                            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Draft'}
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={isSaving}
                                            className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? 'Publishing...' : 'Publish Product'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Footer - Fixed - Compact */}
                    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2.5 flex gap-2 z-20 shadow-lg">
                        <button
                            onClick={() => router.back()}
                            disabled={isSaving}
                            className="px-3 py-2.5 border border-gray-300 rounded-lg font-medium transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSaving}
                            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-3 py-2.5 rounded-lg font-medium transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Draft'}
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSaving}
                            className="flex-1 bg-black hover:bg-gray-900 text-white px-3 py-2.5 rounded-lg font-medium transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
