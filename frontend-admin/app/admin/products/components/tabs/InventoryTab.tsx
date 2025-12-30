/**
 * Inventory Tab (REFACTORED - Domain Store Version)
 * Uses useInventoryStore with MODE ENFORCEMENT
 * CRITICAL: Stock is read-only in VARIANT mode
 */

'use client';

import FormSection from '../FormSection';
import { useInventoryStore } from '@/domains/product/inventory/inventory.store';
import { useVariantsStore } from '@/domains/product/variants/variants.store';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { selectTotalStock } from '@/domains/product/core/product.selectors';
import { generateSKU } from '@/domains/product/variants/sku.generator';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

export default function InventoryTab() {
    const mode = useInventoryStore((state) => state.mode);
    const trackInventory = useInventoryStore((state) => state.trackInventory);
    const stock = useInventoryStore((state) => state.stock);
    const sku = useInventoryStore((state) => state.sku);
    const continueSellingWhenOutOfStock = useInventoryStore((state) => state.continueSellingWhenOutOfStock);
    const lowStockThreshold = useInventoryStore((state) => state.lowStockThreshold);
    const setMode = useInventoryStore((state) => state.setMode);
    const setTrackInventory = useInventoryStore((state) => state.setTrackInventory);
    const setStock = useInventoryStore((state) => state.setStock);
    const setSKU = useInventoryStore((state) => state.setSKU);
    const setContinueSelling = useInventoryStore((state) => state.setContinueSelling);
    const setLowStockThreshold = useInventoryStore((state) => state.setLowStockThreshold);

    const variantsEnabled = useVariantsStore((state) => state.enabled);
    const variants = useVariantsStore((state) => state.variants);
    const productName = useBasicInfoStore((state) => state.name);

    // Sync mode with variants
    useEffect(() => {
        setMode(variantsEnabled ? 'VARIANT' : 'SINGLE');
    }, [variantsEnabled, setMode]);

    // Trigger autosave
    useEffect(() => {
        triggerAutosave('current-user-id');
    }, [trackInventory, stock, sku, continueSellingWhenOutOfStock, lowStockThreshold]);

    const totalStock = selectTotalStock(mode, stock, variants);

    const handleGenerateSKU = () => {
        if (productName) {
            const newSKU = generateSKU(productName);
            setSKU(newSKU);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Inventory Tracking">
                <div className="space-y-4 sm:space-y-5">
                    {/* Track Inventory Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="trackInventory"
                            checked={trackInventory}
                            onChange={(e: any) => setTrackInventory(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="trackInventory" className="text-sm sm:text-base font-medium text-gray-900">
                            Track inventory for this product
                        </label>
                    </div>

                    {trackInventory && (
                        <>
                            {mode === 'VARIANT' ? (
                                /* VARIANT MODE - Stock is READ-ONLY */
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Total Stock (All Variants)
                                    </label>
                                    <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base">
                                        {totalStock} units
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Stock is managed per variant. Go to Variants tab to edit.
                                    </p>
                                </div>
                            ) : (
                                /* SINGLE MODE - Stock is EDITABLE */
                                <>
                                    {/* Stock Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Stock Quantity
                                        </label>
                                        <input
                                            type="number"
                                            id="stock"
                                            value={stock || ''}
                                            onChange={(e: any) => setStock(e.target.value === '' ? 0 : Number(e.target.value))}
                                            onFocus={(e: any) => e.target.select()}
                                            placeholder="0"
                                            min="0"
                                            max="999999"
                                            step="1"
                                            disabled={false}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Continue Selling When Out of Stock */}
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="continueSellingWhenOutOfStock"
                                    checked={continueSellingWhenOutOfStock}
                                    onChange={(e: any) => setContinueSelling(e.target.checked)}
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <label
                                    htmlFor="continueSellingWhenOutOfStock"
                                    className="text-sm sm:text-base text-gray-900"
                                >
                                    Continue selling when out of stock
                                </label>
                            </div>

                            {/* Low Stock Threshold */}
                            <div>
                                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-900 mb-2">
                                    Low Stock Threshold
                                </label>
                                <input
                                    type="number"
                                    id="lowStockThreshold"
                                    value={lowStockThreshold || ''}
                                    onChange={(e: any) => setLowStockThreshold(e.target.value === '' ? undefined : Number(e.target.value))}
                                    onFocus={(e: any) => e.target.select()}
                                    placeholder="10"
                                    min="0"
                                    max="9999"
                                    step="1"
                                    disabled={!trackInventory}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${lowStockThreshold !== undefined && lowStockThreshold > totalStock ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {lowStockThreshold !== undefined && lowStockThreshold > totalStock ? (
                                    <p className="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Threshold cannot exceed total stock ({totalStock})
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        {!trackInventory || stock === 0
                                            ? 'Enable inventory tracking and set stock > 0 to use threshold'
                                            : 'Get notified when stock falls below this number (0-9999)'
                                        }
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </FormSection>
        </div>
    );
}
