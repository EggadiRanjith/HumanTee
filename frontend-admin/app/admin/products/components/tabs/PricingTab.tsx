/**
 * Pricing Tab (REFACTORED - Domain Store Version)
 * Uses usePricingStore instead of monolithic form state
 * Profit calculations via selectors (NEVER stored)
 */

'use client';

import FormSection from '../FormSection';
import { usePricingStore } from '@/domains/product/pricing/pricing.store';
import { selectProfit, selectProfitMargin } from '@/domains/product/core/product.selectors';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

export default function PricingTab() {
    const {
        price,
        compareAtPrice,
        costPerItem,
        currency,
        taxable,
        setPrice,
        setCompareAtPrice,
        setCostPerItem,
        setTaxable,
    } = usePricingStore();

    // Derived data via selectors (NEVER stored)
    const profit = selectProfit(price, costPerItem);
    const profitMargin = selectProfitMargin(price, costPerItem);

    // Trigger autosave on changes
    useEffect(() => {
        triggerAutosave('current-user-id'); // TODO: Get from auth context
    }, [price, compareAtPrice, costPerItem, taxable]);

    return (
        <div className="space-y-6 sm:space-y-8">
            <FormSection title="Pricing">
                <div className="space-y-4 sm:space-y-5">
                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                            Price ({currency}) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price || ''}
                            onChange={(e) => setPrice(e.target.value ? Math.max(0, parseFloat(e.target.value)) : 0)}
                            placeholder="1299"
                            min="0"
                            max="9999999"
                            step="0.01"
                            className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    {/* Compare-at Price */}
                    <div>
                        <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-900 mb-2">
                            Compare-at Price ({currency})
                        </label>
                        <input
                            type="number"
                            id="compareAtPrice"
                            value={compareAtPrice || ''}
                            onChange={(e) =>
                                setCompareAtPrice(e.target.value ? Math.max(0, parseFloat(e.target.value)) : undefined)
                            }
                            placeholder="1999"
                            min="0"
                            max="9999999"
                            step="0.01"
                            className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                        />
                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                            Original price to show customers the discount
                        </p>
                    </div>

                    {/* Cost per Item */}
                    <div>
                        <label htmlFor="costPerItem" className="block text-sm font-medium text-gray-900 mb-2">
                            Cost per Item ({currency})
                        </label>
                        <input
                            type="number"
                            id="costPerItem"
                            value={costPerItem || ''}
                            onChange={(e) =>
                                setCostPerItem(e.target.value ? Math.max(0, parseFloat(e.target.value)) : undefined)
                            }
                            placeholder="500"
                            min="0"
                            max="9999999"
                            step="0.01"
                            className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                        />
                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                            Your cost for this item (for profit calculation)
                        </p>
                    </div>

                    {/* Profit Metrics - Stack on mobile */}
                    {costPerItem !== undefined && price > 0 && profit !== null && profitMargin !== null && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <span className="text-sm font-medium text-green-900">Profit</span>
                                    <p className="text-lg sm:text-xl font-bold text-green-700">
                                        {currency} {profit.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-green-900">Margin</span>
                                    <p className="text-lg sm:text-xl font-bold text-green-700">
                                        {profitMargin.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tax */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="taxable"
                            checked={taxable}
                            onChange={(e) => setTaxable(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="taxable" className="text-sm sm:text-base font-medium text-gray-900">
                            Charge tax on this product
                        </label>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
