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

export default function VariantsTab() {
    const { enabled, variants, setEnabled, addVariant, updateVariant, deleteVariant } = useVariantsStore();
    const { setMode } = useInventoryStore();
    const { name: productName } = useBasicInfoStore();

    // Sync inventory mode with variants
    useEffect(() => {
        setMode(enabled ? 'VARIANT' : 'SINGLE');
    }, [enabled, setMode]);

    // Trigger autosave
    useEffect(() => {
        triggerAutosave('current-user-id');
    }, [enabled, variants]);

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
            color: variant.color,
            colorHex: variant.colorHex,
            stock: variant.stock,
            price: variant.priceOverride,
            weight: variant.weight,
        }));
    }, [variants]);

    // Handle variant changes from VariantManager
    const handleVariantsChange = useCallback((updatedVariants: ProductVariant[]) => {
        const currentVariants = Array.isArray(variants) ? variants : [];
        const currentIds = new Set(currentVariants.map((v) => v.id));
        const nextIds = new Set(updatedVariants.map((v) => v.id));

        // Remove deleted variants
        currentIds.forEach((id) => {
            if (!nextIds.has(id)) {
                deleteVariant(id);
            }
        });

        // Add or update variants
        updatedVariants.forEach((variant) => {
            const existing = currentVariants.find((v) => v.id === variant.id);

            if (!existing) {
                // New variant - add to store
                addVariant({
                    size: variant.size,
                    color: variant.color,
                    colorHex: variant.colorHex,
                    stock: variant.stock,
                    priceOverride: variant.price,
                    weight: variant.weight,
                }, productName || 'Product');
                // Update existing variant
                updateVariant(variant.id, {
                    sku: variant.sku,
                    size: variant.size,
                    color: variant.color,
                    colorHex: variant.colorHex,
                    stock: variant.stock,
                    priceOverride: variant.price,
                    weight: variant.weight,
                });
            }
        });
    }, [variants, productName, addVariant, updateVariant, deleteVariant]);

    return (
        <div className="space-y-6 sm:space-y-8">
            <FormSection title="Product Variants">
                <div className="space-y-4 sm:space-y-5">
                    {/* Enable Variants Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="hasVariants"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="hasVariants" className="text-sm sm:text-base font-medium text-gray-900">
                            This product has multiple variants (sizes, colors)
                        </label>
                    </div>

                    {enabled && (
                        <>
                            {/* Professional Stats Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Variant Overview</h4>
                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <div className="text-xs text-gray-500 mb-1">Total Variants</div>
                                        <div className="text-2xl font-bold text-gray-900">{variants.length}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <div className="text-xs text-gray-500 mb-1">Total Stock</div>
                                        <div className="text-2xl font-bold text-gray-900">{totalStock}</div>
                                        <div className="text-xs text-gray-500 mt-1">units</div>
                                    </div>
                                </div>
                            </div>

                            {/* Variant Manager */}
                            <VariantManager
                                variants={variantsArray}
                                onChange={handleVariantsChange}
                                productName={productName}
                            />
                        </>
                    )}

                    {!enabled && (
                        <p className="text-sm text-gray-500">
                            Enable variants to manage different sizes and colors for this product.
                        </p>
                    )}
                </div>
            </FormSection>
        </div>
    );
}
