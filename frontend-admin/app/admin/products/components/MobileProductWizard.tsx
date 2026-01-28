/**
 * Mobile Product Wizard
 * Step-by-step product creation for mobile devices
 * No tabs, no scrolling - one section at a time
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoTab from './tabs/BasicInfoTab';
import MediaTab from './tabs/MediaTab';
import PricingTab from './tabs/PricingTab';
import VariantsTab from './tabs/VariantsTab';
import InventoryTab from './tabs/InventoryTab';
import OrganizationTab from './tabs/OrganizationTab';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { usePricingStore } from '@/domains/product/pricing/pricing.store';
import { aggregateProductData, sanitizeProductDataForAPI, markAllDomainsClean } from '@/domains/product/autosave/autosave.service';
import { discardDraft } from '@/domains/product/autosave/draft.recovery';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { UploadProgressModal } from '../../../components/UploadProgressModal';
import { useImageUploads } from '../../../hooks/useImageUploads';

const STEPS = [
    { key: 'basic', label: 'Basic Info', component: BasicInfoTab },
    { key: 'media', label: 'Media', component: MediaTab },
    { key: 'pricing', label: 'Pricing', component: PricingTab },
    { key: 'variants', label: 'Variants', component: VariantsTab },
    { key: 'inventory', label: 'Inventory', component: InventoryTab },
    { key: 'organization', label: 'Organization', component: OrganizationTab },
] as const;

interface MobileProductWizardProps {
    productId?: string;
}

export default function MobileProductWizard({ productId }: MobileProductWizardProps = {}) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Image upload hook for deferred uploads
    const { uploadItems, isUploading, uploadPendingImages } = useImageUploads();

    // Get validation state
    const { name } = useBasicInfoStore();
    const { price } = usePricingStore();

    const CurrentStepComponent = STEPS[currentStep].component;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    // Validation for current step
    const canContinue = () => {
        if (currentStep === 0) {
            // Basic info validation
            return name.trim().length > 0;
        }
        if (currentStep === 2) {
            // Pricing validation
            return price > 0;
        }
        return true;
    };

    const handleNext = () => {
        if (!canContinue()) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSave = async () => {
        if (!canContinue()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const productData = aggregateProductData();

            if (productId) {
                // STEP 1: Upload images to Cloudinary (shows progress modal)
                toast.info('Uploading images...');
                const imagesWithCloudinaryUrls = await uploadPendingImages(productData.images);
                toast.success('Images uploaded!');

                // STEP 2: Edit mode - save to database
                toast.info('Saving product...');
                const sanitizedData = {
                    name: productData.name,
                    description: productData.description,
                    productType: productData.productType,
                    category: productData.category,
                    price: productData.price,
                    compareAtPrice: productData.compareAtPrice,
                    costPerItem: productData.costPerItem,
                    taxable: productData.taxable,
                    hasVariants: productData.hasVariants,
                    trackInventory: productData.trackInventory,
                    stock: productData.stock,
                    sku: productData.sku,
                    continueSellingWhenOutOfStock: productData.continueSellingWhenOutOfStock,
                    lowStockThreshold: productData.lowStockThreshold,
                    status: productData.status,
                    isFeatured: productData.isFeatured,
                    collections: productData.collections,
                    // Use Cloudinary URLs - NO BASE64!
                    images: imagesWithCloudinaryUrls.map((img: any, index: number) => ({
                        url: img.cloudinaryUrl || img.url,
                        altText: img.altText,
                        isPrimary: img.isPrimary,
                        order: index,
                    })),
                    variants: productData.variants.map((v: any) => ({
                        size: v.size,
                        color: v.color,
                        colorHex: v.colorHex,
                        sku: v.sku,
                        stock: Number(v.stock) || 0,
                        priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
                        weight: v.weight ? Number(v.weight) : undefined,
                    })),
                };

                await apiClient.put(`/admin/products/${productId}`, sanitizedData);
                toast.success('Product updated successfully!');
            } else {
                // STEP 1: Upload images to Cloudinary (shows progress modal)
                toast.info('Uploading images...');
                const imagesWithCloudinaryUrls = await uploadPendingImages(productData.images);
                toast.success('Images uploaded!');

                // STEP 2: Create mode - save to database
                toast.info('Creating product...');

                // Map images to API format (only send url, altText, isPrimary, order)
                const mappedImages = imagesWithCloudinaryUrls.map((img: any, index: number) => ({
                    url: img.cloudinaryUrl || img.url,
                    altText: img.altText,
                    isPrimary: img.isPrimary,
                    order: index,
                }));

                const sanitizedData = sanitizeProductDataForAPI({
                    ...productData,
                    images: mappedImages as any, // Type assertion to bypass mismatch
                });
                await apiClient.post('/admin/products', sanitizedData);
                toast.success('Product created successfully!');
                discardDraft(); // Clear draft from localStorage
            }

            markAllDomainsClean();
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save product');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header with Progress */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 py-4">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <span className="text-xs text-gray-500">
                            {STEPS[currentStep].label}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-black h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 pb-28">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-black mb-4">
                        {STEPS[currentStep].label}
                    </h2>
                    <CurrentStepComponent />
                </div>
            </div>

            {/* Navigation Buttons - Fixed to Bottom */}
            <div className="bg-white border-t border-gray-200 px-4 py-4 fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-2xl mx-auto flex gap-2">
                    <button
                        onClick={() => router.push('/admin/products')}
                        disabled={isSaving}
                        className="px-3 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex-shrink-0"
                        title="Cancel"
                    >
                        ✕
                    </button>

                    {!isFirstStep && (
                        <button
                            onClick={handleBack}
                            disabled={isSaving}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            ← Back
                        </button>
                    )}

                    {isLastStep ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !canContinue()}
                            className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Product'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!canContinue()}
                            className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue →
                        </button>
                    )}
                </div>
            </div>

            {/* Upload Progress Modal */}
            <UploadProgressModal
                isOpen={isUploading}
                items={uploadItems}
            />
        </div>
    );
}
