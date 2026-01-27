/**
 * Product Edit Page
 * Reuses the same form as product creation but loads existing product data
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { TabKey } from '@/types/product-form.types';
import TabNavigation from '../../components/TabNavigation';
import BasicInfoTab from '../../components/tabs/BasicInfoTab';
import MediaTab from '../../components/tabs/MediaTab';
import PricingTab from '../../components/tabs/PricingTab';
import VariantsTab from '../../components/tabs/VariantsTab';
import InventoryTab from '../../components/tabs/InventoryTab';
import OrganizationTab from '../../components/tabs/OrganizationTab';
import MobileProductWizard from '../../components/MobileProductWizard';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { useMediaStore } from '@/domains/product/media/media.store';
import { usePricingStore } from '@/domains/product/pricing/pricing.store';
import { useInventoryStore } from '@/domains/product/inventory/inventory.store';
import { useVariantsStore } from '@/domains/product/variants/variants.store';
import { useOrganizationStore } from '@/domains/product/organization/organization.store';
import { aggregateProductData, markAllDomainsClean } from '@/domains/product/autosave/autosave.service';
import { toast } from 'sonner';

interface ProductEditPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>('basic');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch product data
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/products/${id}`);
            return response.data;
        },
    });

    // Load product data into stores
    useEffect(() => {
        if (product && !isLoaded) {
            const basicInfoStore = useBasicInfoStore.getState();
            const pricingStore = usePricingStore.getState();
            const inventoryStore = useInventoryStore.getState();
            const variantsStore = useVariantsStore.getState();
            const mediaStore = useMediaStore.getState();
            const organizationStore = useOrganizationStore.getState();

            // Reset all stores first
            basicInfoStore.reset();
            pricingStore.reset();
            inventoryStore.reset();
            variantsStore.reset();
            mediaStore.reset();
            organizationStore.reset();

            // Load basic info
            basicInfoStore.setName(product.name || '');
            basicInfoStore.setDescription(product.description || '');
            basicInfoStore.setProductType(product.productType || '');
            basicInfoStore.setCategory(product.category || '');

            // Load pricing
            pricingStore.setPrice(product.basePrice || 0);
            pricingStore.setCompareAtPrice(product.compareAtPrice || 0);
            pricingStore.setCostPerItem(product.costPerItem || 0);
            pricingStore.setTaxable(product.taxable || false);

            // Load inventory
            inventoryStore.setSKU(product.sku || '');
            inventoryStore.setTrackInventory(product.trackQuantity !== false);
            if (product.stock !== undefined) {
                inventoryStore.setStock(product.stock);
            }

            // Load variants
            if (product.variants && product.variants.length > 0) {
                variantsStore.setVariants(product.variants.map((v: any) => ({
                    id: v.id,
                    size: v.size,
                    color: v.color,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock || v.stock_quantity || 0,
                    isActive: v.isActive !== false,
                })));
            }

            // Load media
            if (product.images && product.images.length > 0) {
                mediaStore.setImages(product.images.map((img: any) => ({
                    id: img.id,
                    url: img.cloudinaryUrl || img.url,
                    altText: img.altText || '',
                    isPrimary: img.isPrimary || false,
                })));
            }

            // Load organization
            organizationStore.setStatus(product.status || 'DRAFT');
            organizationStore.setFeatured(product.isFeatured || false);

            // Mark as clean after loading
            markAllDomainsClean();
            setIsLoaded(true);
        }
    }, [product, isLoaded]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const productData = aggregateProductData();

            // Sanitize data - remove fields backend doesn't accept
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
                // Sanitize images - remove id but keep order
                images: productData.images.map((img: any, index: number) => ({
                    url: img.cloudinaryUrl || img.url,
                    altText: img.altText,
                    isPrimary: img.isPrimary,
                    order: index,
                })),
                // Sanitize variants - remove id, stockQuantity, isActive and rename to stock
                variants: productData.variants.map((v: any) => ({
                    size: v.size,
                    color: v.color,
                    colorHex: v.colorHex,
                    sku: v.sku,
                    stock: Number(v.stock) || 0,
                    priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined,
                    weight: v.weight ? Number(v.weight) : undefined,
                    // ⚠️ Strip out backend-only properties:isActive, id, skuLocked
                })),
            };

            await apiClient.put(`/admin/products/${id}`, sanitizedData);
            toast.success('Product updated successfully!');
            markAllDomainsClean();

            // Force page reload to show updated data
            router.push(`/admin/products/${id}?t=${Date.now()}`);
        } catch (error: any) {
            console.error('Save error:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/admin/products/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile: Show wizard instead of tabs */}
            {isMobile ? (
                <MobileProductWizard productId={id} />
            ) : (
                <>
                    {/* Header - Compact Mobile */}
                    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-3 md:py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black">Edit Product</h1>
                                    <p className="text-xs md:text-sm text-gray-600 mt-1">{product?.name}</p>
                                </div>
                                <div className="flex gap-2 md:gap-3">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-xs md:text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-4 md:px-6 py-1.5 md:py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2 text-xs md:text-sm"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8">
                            <TabNavigation
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                tabs={[
                                    { key: 'basic', label: 'Basic Info', icon: '📝', hasErrors: false },
                                    { key: 'media', label: 'Media', icon: '🖼️', hasErrors: false },
                                    { key: 'pricing', label: 'Pricing', icon: '💰', hasErrors: false },
                                    { key: 'variants', label: 'Variants', icon: '🎨', hasErrors: false },
                                    { key: 'inventory', label: 'Inventory', icon: '📦', hasErrors: false },
                                    { key: 'organization', label: 'Organization', icon: '🏷️', hasErrors: false },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Tab Content - Compact Mobile */}
                    <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-6 lg:py-8 pb-20 md:pb-8">
                        {activeTab === 'basic' && <BasicInfoTab />}
                        {activeTab === 'media' && <MediaTab />}
                        {activeTab === 'pricing' && <PricingTab />}
                        {activeTab === 'variants' && <VariantsTab />}
                        {activeTab === 'inventory' && <InventoryTab />}
                        {activeTab === 'organization' && <OrganizationTab />}
                    </div>

                    {/* Tab Navigation Buttons - Fixed Bottom on Mobile */}
                    <div className="fixed md:relative bottom-0 left-0 right-0 md:max-w-7xl md:mx-auto md:px-3 lg:px-8 bg-white border-t border-gray-200 px-3 py-2.5 md:py-4 md:mt-6 lg:mt-8 shadow-lg md:shadow-none z-30">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    const tabs: TabKey[] = ['basic', 'media', 'pricing', 'variants', 'inventory', 'organization'];
                                    const currentIndex = tabs.indexOf(activeTab);
                                    if (currentIndex > 0) {
                                        setActiveTab(tabs[currentIndex - 1]);
                                    }
                                }}
                                disabled={activeTab === 'basic'}
                                className="px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                            >
                                ← Back
                            </button>

                            {activeTab !== 'organization' ? (
                                <button
                                    onClick={() => {
                                        const tabs: TabKey[] = ['basic', 'media', 'pricing', 'variants', 'inventory', 'organization'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        if (currentIndex < tabs.length - 1) {
                                            setActiveTab(tabs[currentIndex + 1]);
                                        }
                                    }}
                                    className="px-4 md:px-6 py-1.5 md:py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-xs md:text-sm"
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="px-4 md:px-6 py-1.5 md:py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-xs md:text-sm"
                                >
                                    <span className="hidden sm:inline">End of Form - Use "Save Changes" Above</span>
                                    <span className="sm:hidden">Use "Save" Above</span>
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
