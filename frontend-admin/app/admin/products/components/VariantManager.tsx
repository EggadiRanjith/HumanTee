/**
 * Variant Manager Component
 * Main interface for managing product variants
 */

'use client';

import { useState } from 'react';
import { ProductVariant } from '@/types/product-form.types';
import VariantForm from './VariantForm';

interface VariantManagerProps {
    variants: ProductVariant[];
    productName: string;
    onChange: (variants: ProductVariant[]) => void;
}

export default function VariantManager({
    variants,
    productName,
    onChange,
}: VariantManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

    const handleAdd = (variant: ProductVariant) => {
        onChange([...variants, variant]);
        setIsAdding(false);
    };

    const handleUpdate = (updatedVariant: ProductVariant) => {
        onChange(
            variants.map((v) => (v.id === updatedVariant.id ? updatedVariant : v))
        );
        setEditingVariant(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this variant?')) {
            onChange(variants.filter((v) => v.id !== id));
        }
    };

    return (
        <div className="space-y-4">
            {/* Variant List */}
            {variants.length > 0 && (
                <div className="space-y-3">
                    {variants.map((variant) => (
                        <div
                            key={variant.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                            {editingVariant?.id === variant.id ? (
                                <VariantForm
                                    variant={variant}
                                    productName={productName}
                                    onSave={handleUpdate}
                                    onCancel={() => setEditingVariant(null)}
                                />
                            ) : (
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Color Swatch */}
                                        <div
                                            className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
                                            style={{ backgroundColor: variant.colorHex }}
                                            title={variant.color}
                                        />

                                        {/* Variant Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-black">
                                                    {variant.size}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-900">{variant.color}</span>
                                                {variant.price && (
                                                    <>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-900">₹{variant.price}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                SKU: {variant.sku} • Stock: {variant.stock}
                                                {variant.weight && ` • ${variant.weight}g`}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setEditingVariant(variant)}
                                            className="text-sm text-black hover:underline font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(variant.id)}
                                            className="text-sm text-red-600 hover:underline font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Variant Form */}
            {isAdding ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-black mb-4">Add New Variant</h3>
                    <VariantForm
                        productName={productName}
                        onSave={handleAdd}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 font-medium transition-colors"
                >
                    + Add Variant
                </button>
            )}

            {/* Empty State */}
            {variants.length === 0 && !isAdding && (
                <p className="text-sm text-gray-500 text-center py-4">
                    No variants added yet. Add size and color combinations for this product.
                </p>
            )}
        </div>
    );
}
