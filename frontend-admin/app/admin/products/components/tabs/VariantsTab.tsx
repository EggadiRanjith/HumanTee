/**
 * Variants Tab (REFACTORED - Domain Store Version)
 * Uses useVariantsStore with UUID-based variant management
 */

'use client';

import FormSection from '../FormSection';
import { useVariantsStore } from '@/domains/product/variants/variants.store';
import { useInventoryStore } from '@/domains/product/inventory/inventory.store';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { selectTotalStock } from '@/domains/product/core/product.selectors';
import { useEffect, useMemo, useCallback } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';
import VariantManager from '../VariantManager';
import type { ProductVariant } from '@/types/product-form.types';

interface VariantsTabProps {
    errors?: {
        variants?: string;
    };
}

export default function VariantsTab({ errors }: VariantsTabProps) {
    const { enabled, variants, setEnabled, addVariant, updateVariant, deleteVariant } = useVariantsStore();
    const { setMode } = useInventoryStore();
    const { name: productName } = useBasicInfoStore();

    // Sync inventory mode with variants
    useEffect(() => {
        setMode(enabled ? 'VARIANT' : 'SINGLE');
    }, [enabled, setMode]);

    // Trigger autosave
    useEffect(() => {
        const isEditMode = typeof window !== 'undefined' && window.location.pathname.includes('/edit');
        const productId = isEditMode ? 'editing' : undefined;
        triggerAutosave('current-user-id', productId);
    }, [variants]);

    const totalStock = selectTotalStock(
        enabled ? 'VARIANT' : 'SINGLE',
        0,
        variants
    );

    // Convert to VariantManager format
    const variantsArray = useMemo((): ProductVariant[] => {
        const currentVariants = Array.isArray(variants) ? variants : [];

        return currentVariants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            size: variant.size,
            stock: variant.stock || 0,
            price: variant.priceOverride,
        }));
    }, [variants]);

    // Handle variant changes from VariantManager
    const handleVariantsChange = useCallback((updatedVariants: ProductVariant[]) => {
        const currentVariants = Array.isArray(variants) ? variants : [];
        const currentIds = new Set(currentVariants.map((v: any) => v.id));
        const nextIds = new Set(updatedVariants.map((v: any) => v.id));

        // Remove deleted variants
        currentIds.forEach((id) => {
            if (!nextIds.has(id)) {
                deleteVariant(id);
            }
        });

        // Add or update variants
        updatedVariants.forEach((variant) => {
            const existing = currentVariants.find((v: any) => v.id === variant.id);

            if (!existing) {
                // New variant - add to store
                addVariant({
                    size: variant.size,
                    stock: variant.stock,
                    priceOverride: variant.price,
                }, productName || 'Product');
            } else {
                // Update existing variant
                updateVariant(variant.id, {
                    sku: variant.sku,
                    size: variant.size,
                    stock: variant.stock,
                    priceOverride: variant.price,
                });
            }
        });
    }, [variants, productName, addVariant, updateVariant, deleteVariant]);

    return (
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <FormSection title="Product Variants">
                <div className="space-y-3 md:space-y-4 lg:space-y-5">
                    {/* Info Message - Compact Mobile */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3">
                        <p className="text-xs md:text-sm text-blue-800">
                            <strong>Note:</strong> All products require at least one variant (size). Add all available sizes for this product.
                        </p>
                    </div>

                    {/* Professional Stats Card - Compact Mobile */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 md:p-4 lg:p-5">
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                            <h4 className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide">Variant Overview</h4>
                            <span className="text-[10px] md:text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                            <div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
                                <div className="text-[10px] md:text-xs text-gray-500 mb-1">Total Variants</div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900">{variants.length}</div>
                            </div>
                            <div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
                                <div className="text-[10px] md:text-xs text-gray-500 mb-1">Total Stock</div>
                                <div className="text-xl md:text-2xl font-bold text-gray-900">{totalStock}</div>
                                <div className="text-[10px] md:text-xs text-gray-500 mt-1">units</div>
                            </div>
                        </div>
                    </div>

                    {/* Variant Manager */}
                    <VariantManager
                        variants={variantsArray}
                        onChange={handleVariantsChange}
                        productName={productName}
                    />

                    {errors?.variants && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.variants}
                        </p>
                    )}
                </div>
            </FormSection>
        </div>
    );
}
