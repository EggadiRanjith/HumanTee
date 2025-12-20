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
                            onChange={(e) => setTrackInventory(e.target.checked)}
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
                                            value={stock}
                                            onChange={(e) => setStock(Number(e.target.value))}
                                            placeholder="100"
                                            min="0"
                                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                                        />
                                    </div>

                                    {/* SKU with Generate Button */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            SKU (Stock Keeping Unit)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={sku || ''}
                                                onChange={(e) => setSKU(e.target.value || undefined)}
                                                placeholder="e.g., PCT-X7Y9"
                                                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleGenerateSKU}
                                                disabled={!productName}
                                                className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Continue Selling When Out of Stock */}
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="continueSellingWhenOutOfStock"
                                    checked={continueSellingWhenOutOfStock}
                                    onChange={(e) => setContinueSelling(e.target.checked)}
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
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Low Stock Threshold
                                </label>
                                <input
                                    type="number"
                                    value={lowStockThreshold || ''}
                                    onChange={(e) =>
                                        setLowStockThreshold(e.target.value ? Number(e.target.value) : undefined)
                                    }
                                    placeholder="10"
                                    min="0"
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Get notified when stock falls below this number
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </FormSection>
        </div>
    );
}
