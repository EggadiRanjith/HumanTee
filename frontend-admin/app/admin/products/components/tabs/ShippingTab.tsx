/**
 * Shipping Tab
 * Physical product, shipping requirements, weight, dimensions
 */

'use client';

import { ProductFormData } from '@/types/product-form.types';
import { formatWeight, formatDimensions } from '@/utils/product-form.utils';
import FormSection from '../FormSection';

interface ShippingTabProps {
    data: ProductFormData;
    onChange: (data: Partial<ProductFormData>) => void;
    errors: { [key: string]: string };
}

export default function ShippingTab({ data, onChange, errors }: ShippingTabProps) {
    return (
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Shipping">
                <div className="space-y-4 sm:space-y-5">
                    {/* Physical Product Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPhysicalProduct"
                            checked={data.isPhysicalProduct}
                            onChange={(e) => onChange({ isPhysicalProduct: e.target.checked })}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="isPhysicalProduct" className="text-sm sm:text-base font-medium text-gray-900">
                            This is a physical product
                        </label>
                    </div>

                    {data.isPhysicalProduct && (
                        <>
                            {/* Requires Shipping Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="requiresShipping"
                                    checked={data.requiresShipping}
                                    onChange={(e) => onChange({ requiresShipping: e.target.checked })}
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <label htmlFor="requiresShipping" className="text-sm sm:text-base text-gray-900">
                                    Requires shipping
                                </label>
                            </div>

                            {data.requiresShipping && (
                                <>
                                    {/* Weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Weight (grams)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.weight || ''}
                                            onChange={(e) =>
                                                onChange({
                                                    weight: e.target.value ? Number(e.target.value) : undefined,
                                                })
                                            }
                                            placeholder="250"
                                            min="0"
                                            className={`
                                                w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black outline-none transition-colors text-sm sm:text-base
                                                ${errors.weight ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}
                                            `}
                                        />
                                        {errors.weight && (
                                            <p className="text-xs text-red-600 mt-1.5">{errors.weight}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1.5">
                                            Used to calculate shipping rates
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </FormSection>
        </div>
    );
}
