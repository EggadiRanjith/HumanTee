/**
 * Variants Tab (REFACTORED - Domain Store Version)
 * Uses useVariantsStore with UUID-based variant management
 */

'use client';

import FormSection from '../FormSection';
import { useVariantsStore } from '@/domains/product/variants/variants.store';
import { useInventoryStore } from '@/domains/product/inventory/inventory.store';
import { selectTotalStock } from '@/domains/product/core/product.selectors';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

export default function VariantsTab() {
    const { enabled, variants, setEnabled } = useVariantsStore();
    const { setMode } = useInventoryStore();

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

    return (
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Product Variants">
                <div className="space-y-4">
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
                        <div className="mt-4">
                            {/* Variant Stats */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-900">Total Variants</span>
                                    <span className="text-lg font-bold text-blue-700">{variants.size}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-medium text-blue-900">Total Stock</span>
                                    <span className="text-lg font-bold text-blue-700">{totalStock} units</span>
                                </div>
                            </div>

                            {/* Variant Manager Component */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    Variant management component will be integrated here.
                                    <br />
                                    Features: Add/Edit/Delete variants, SKU generation, stock management.
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Note: Using UUID-based Map for performance with 100+ variants.
                                </p>
                            </div>
                        </div>
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
