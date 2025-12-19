'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Product Creation Page
 * Clean, professional, mobile-responsive
 * Form to create new products
 */

export default function NewProductPage() {
    const router = useRouter();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        status: 'DRAFT',
        category: '',
    });

    const handleCreate = () => {
        if (!product.name || !product.price) {
            alert('Please fill in required fields');
            return;
        }
        alert('Product created! (Mock action)');
        router.push('/admin/products');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-600 hover:text-black mb-3 inline-block"
                >
                    ← Back to products
                </button>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold text-black">Create New Product</h1>
                        <p className="text-sm text-gray-600 mt-1">Add a new product to your catalog</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => router.back()}
                            className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm"
                        >
                            Create Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    placeholder="e.g., Premium Cotton T-Shirt"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    placeholder="Describe your product..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        value={product.price || ''}
                                        onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                        placeholder="1299"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Initial Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={product.stock || ''}
                                        onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                                        placeholder="50"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Variants (Optional)</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Add size and color variants for this product
                        </p>
                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700">
                            + Add Variant
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Status</h2>
                        <select
                            value={product.status}
                            onChange={(e) => setProduct({ ...product, status: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-black focus:border-black outline-none"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="ACTIVE">Active</option>
                        </select>
                        <p className="text-xs text-gray-600 mt-2">
                            Draft products won't be visible to customers
                        </p>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Category</h2>
                        <input
                            type="text"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            placeholder="e.g., T-Shirts"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                        />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Product Image</h2>
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📷</div>
                                <div className="text-sm text-gray-500">No image uploaded</div>
                            </div>
                        </div>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                            Upload Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
