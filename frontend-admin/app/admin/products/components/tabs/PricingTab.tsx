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
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Pricing">
                <div className="space-y-4 sm:space-y-5">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Price ({currency}) *
                        </label>
                        <input
                            type="number"
                            value={price || ''}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            placeholder="1299"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                        />
                    </div>

                    {/* Compare-at Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Compare-at Price ({currency})
                        </label>
                        <input
                            type="number"
                            value={compareAtPrice || ''}
                            onChange={(e) =>
                                setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)
                            }
                            placeholder="1999"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            Original price to show customers the discount
                        </p>
                    </div>

                    {/* Cost per Item */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Cost per Item ({currency})
                        </label>
                        <input
                            type="number"
                            value={costPerItem || ''}
                            onChange={(e) =>
                                setCostPerItem(e.target.value ? Number(e.target.value) : undefined)
                            }
                            placeholder="500"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            Your cost for this product (for profit tracking)
                        </p>
                    </div>

                    {/* Profit Margin Display (CALCULATED, NOT STORED) */}
                    {profitMargin !== null && profitMargin > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-900">Profit Margin</span>
                                <span className="text-lg sm:text-xl font-bold text-green-700">
                                    {profitMargin.toFixed(1)}%
                                </span>
                            </div>
                            <p className="text-xs text-green-700 mt-1">
                                Profit: {currency} {profit?.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>
            </FormSection>

            <FormSection title="Tax Settings">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="taxable"
                        checked={taxable}
                        onChange={(e) => setTaxable(e.target.checked)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <label htmlFor="taxable" className="text-sm sm:text-base text-gray-900">
                        Charge tax on this product
                    </label>
                </div>
            </FormSection>
        </div>
    );
}
