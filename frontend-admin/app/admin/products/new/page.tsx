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
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { usePricingStore } from '@/domains/product/pricing/pricing.store';
import { useInventoryStore } from '@/domains/product/inventory/inventory.store';
import { useVariantsStore } from '@/domains/product/variants/variants.store';
import { useOrganizationStore } from '@/domains/product/organization/organization.store';
import { observeHasUnsavedChanges, aggregateProductData, markAllDomainsClean } from '@/domains/product/autosave/autosave.service';
import { attemptDraftRecovery, discardDraft } from '@/domains/product/autosave/draft.recovery';
import { ConfirmActionModal } from '@/app/admin/components/ConfirmActionModal';

export default function NewProductPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>('basic');
    const [isSaving, setIsSaving] = useState(false);
    const [showDraftRecovery, setShowDraftRecovery] = useState(false);

    // Get state from stores for validation
    const { name } = useBasicInfoStore();
    const { price } = usePricingStore();

    // Attempt draft recovery on mount
    useEffect(() => {
        const draft = attemptDraftRecovery();
        if (draft) {
            setShowDraftRecovery(true);
        }
    }, []);

    // Tab configuration with error detection
    const tabs = [
        { key: 'basic' as TabKey, label: 'Basic Info', icon: '📝', hasErrors: !name },
        { key: 'media' as TabKey, label: 'Media', icon: '📸' },
        { key: 'pricing' as TabKey, label: 'Pricing', icon: '💰', hasErrors: !price || price <= 0 },
        { key: 'variants' as TabKey, label: 'Variants', icon: '🎨' },
        { key: 'inventory' as TabKey, label: 'Inventory', icon: '📦', hasErrors: false },
        { key: 'organization' as TabKey, label: 'Organization', icon: '🏷️', hasErrors: false },
    ];

    const handleSaveDraft = async () => {
        if (!name) {
            alert('Product name is required to save a draft');
            setActiveTab('basic');
            return;
        }

        setIsSaving(true);
        try {
            const productData = aggregateProductData();

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

                // Media
                images: productData.images.map(img => ({
                    url: img.url,
                    altText: img.altText || '',
                    isPrimary: img.isPrimary,
                    order: img.order,
                })),

                // Variants
                hasVariants: productData.hasVariants,
                inventoryMode: (productData.hasVariants ? 'VARIANT' : 'SINGLE') as any,
                variants: productData.hasVariants ? productData.variants.map(v => ({
                    size: v.size,
                    color: v.color,
                    colorHex: v.colorHex || '#000000',
                    sku: v.sku || '',
                    stock: Number(v.stock) || 0,
                    priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
                    weight: v.weight ? Number(v.weight) : undefined,
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
                ? draftRequest.variants.reduce((sum, v) => sum + v.stock, 0)
                : (draftRequest.stock || 0);

            if (draftRequest.lowStockThreshold && draftRequest.lowStockThreshold > totalStockCount) {
                alert(`Low stock threshold (${draftRequest.lowStockThreshold}) cannot exceed total stock (${totalStockCount})`);
                return;
            }

            const { createProduct } = await import('@/lib/api/products');
            const created = await createProduct(draftRequest as any);

            markAllDomainsClean();
            discardDraft();

            alert('Draft saved to database!');
            router.push(`/admin/products/${created.id}`);
        } catch (error) {
            console.error('Failed to save draft:', error);
            alert(error instanceof Error ? error.message : 'Failed to save draft');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        // Validation
        if (!name) {
            alert('Product name is required');
            setActiveTab('basic');
            return;
        }
        if (!price || price <= 0) {
            alert('Valid price is required');
            setActiveTab('pricing');
            return;
        }

        setIsSaving(true);
        try {
            const productData = aggregateProductData();
            console.log('Raw product data:', productData);

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

                // Media
                images: productData.images.map(img => ({
                    url: img.url,
                    altText: img.altText || '',
                    isPrimary: img.isPrimary,
                    order: img.order,
                })),

                // Variants
                hasVariants: productData.hasVariants,
                inventoryMode: (productData.hasVariants ? 'VARIANT' : 'SINGLE') as any,
                variants: productData.hasVariants ? productData.variants.map(v => ({
                    size: v.size,
                    color: v.color,
                    colorHex: v.colorHex || '#000000',
                    sku: v.sku || '',
                    stock: Number(v.stock) || 0,
                    priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
                    weight: v.weight ? Number(v.weight) : undefined,
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
                ? publishRequest.variants.reduce((sum, v) => sum + v.stock, 0)
                : (publishRequest.stock || 0);

            if (publishRequest.lowStockThreshold && publishRequest.lowStockThreshold > totalStockCount) {
                alert(`Low stock threshold (${publishRequest.lowStockThreshold}) cannot exceed total stock (${totalStockCount})`);
                return;
            }

            console.log('Transformed request:', publishRequest);

            // Call backend API to create product
            const { createProduct } = await import('@/lib/api/products');
            const createdProduct = await createProduct(publishRequest as any);

            console.log('Product created successfully:', createdProduct);

            // Lock all variant SKUs
            useVariantsStore.getState().lockAllSKUs();

            markAllDomainsClean();
            discardDraft(); // Clear draft after successful publish

            alert('Product published successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to publish product:', error);
            alert(error instanceof Error ? error.message : 'Failed to publish product');
        } finally {
            setIsSaving(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return <BasicInfoTab />;
            case 'media':
                return <MediaTab />;
            case 'pricing':
                return <PricingTab />;
            case 'variants':
                return <VariantsTab />;
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
            {/* Draft Recovery Banner - Improved UX */}
            {showDraftRecovery && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-4 sm:px-6 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">Draft Found</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">
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
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Start Fresh
                                </button>
                                <button
                                    onClick={() => setShowDraftRecovery(false)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Continue Editing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header - Sticky */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600 hover:text-black mb-3 inline-flex items-center gap-1"
                    >
                        ← Back to products
                    </button>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl font-semibold text-black">
                                Create New Product
                            </h1>
                            {hasUnsavedChanges && (
                                <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-orange-600 rounded-full"></span>
                                    Unsaved changes
                                </p>
                            )}
                        </div>
                        <div className="hidden sm:flex gap-2 flex-shrink-0">
                            <button
                                onClick={() => router.back()}
                                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                            >
                                Cancel
                            </button>
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
                        onTabChange={setActiveTab}
                    />
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-8">
                {renderTabContent()}
            </div>

            {/* Mobile Footer - Fixed */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 z-20 shadow-lg">
                <button
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="flex-1 bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Publishing...' : 'Publish'}
                </button>
            </div>
        </div>
    );
}
