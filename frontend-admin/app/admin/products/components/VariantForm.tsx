/**
 * Variant Form Component
 * Form for creating/editing individual product variants
 */

'use client';

import { useState } from 'react';
import { ProductVariant } from '@/types/product-form.types';
import { generateSKU } from '@/utils/product-form.utils';


interface VariantFormProps {
    variant?: ProductVariant;
    productName: string;
    onSave: (variant: ProductVariant) => void;
    onCancel: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function VariantForm({
    variant,
    productName,
    onSave,
    onCancel,
}: VariantFormProps) {
    const [formData, setFormData] = useState<ProductVariant>(
        variant || {
            id: `variant-${Date.now()}`,
            sku: '',
            size: '',
            stock: 0,
        }
    );

    const handleGenerateSKU = () => {
        const sku = generateSKU(productName, formData);
        setFormData({ ...formData, sku });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.sku || !formData.size) {
            alert('Please fill in all required fields');
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Size Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Size *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setFormData({ ...formData, size })}
                            className={`
                px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${formData.size === size
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 text-gray-900 hover:border-gray-400'
                                }
              `}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>



            {/* SKU */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    SKU *
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={formData.sku}
                        onChange={(e: any) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g., HT-M-BLK-A1B2"
                        className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleGenerateSKU}
                        className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                    >
                        Generate
                    </button>
                </div>
            </div>

            {/* Stock */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Stock Quantity
                </label>
                <input
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e: any) =>
                        setFormData({ ...formData, stock: e.target.value === '' ? 0 : Number(e.target.value) })
                    }
                    onFocus={(e: any) => e.target.select()}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
            </div>

            {/* Price Override */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Price Override (Optional)
                </label>
                <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e: any) =>
                        setFormData({
                            ...formData,
                            price: e.target.value ? Number(e.target.value) : undefined,
                        })
                    }
                    onFocus={(e: any) => e.target.select()}
                    placeholder="Leave empty to use base price"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
            </div>



            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <button
                    type="submit"
                    className="flex-1 bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                    {variant ? 'Update Variant' : 'Add Variant'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
