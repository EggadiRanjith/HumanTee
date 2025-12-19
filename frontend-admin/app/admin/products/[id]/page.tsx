'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Product Detail/Edit Page
 * Clean, professional, mobile-responsive
 * Mock data for demonstration
 */

// Mock product data
const mockProduct = {
    id: 'PROD123',
    name: 'Premium T-Shirt',
    description: 'High-quality cotton t-shirt with premium finish',
    price: 1299,
    stock: 45,
    status: 'ACTIVE',
    category: 'T-Shirts',
    images: [
        '/placeholder-product.jpg',
    ],
    variants: [
        { id: '1', size: 'S', color: 'Black', stock: 10 },
        { id: '2', size: 'M', color: 'Black', stock: 15 },
        { id: '3', size: 'L', color: 'Black', stock: 20 },
    ],
};

export default function ProductDetailPage() {
    const router = useRouter();
    const [product, setProduct] = useState(mockProduct);

    const handleSave = () => {
        alert('Product saved! (Mock action)');
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
                        <h1 className="text-xl md:text-2xl font-semibold text-black">Edit Product</h1>
                        <p className="text-sm text-gray-600 mt-1">ID: {product.id}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm"
                        >
                            Save Changes
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm">
                            Delete
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
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={product.stock}
                                        onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Variants</h2>
                        <div className="space-y-3">
                            {product.variants.map((variant) => (
                                <div key={variant.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <div className="font-medium text-black">{variant.size} / {variant.color}</div>
                                        <div className="text-sm text-gray-600">Stock: {variant.stock}</div>
                                    </div>
                                    <button className="text-sm text-red-600 hover:text-red-700">Remove</button>
                                </div>
                            ))}
                            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700">
                                + Add Variant
                            </button>
                        </div>
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
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Category</h2>
                        <input
                            type="text"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none"
                        />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Product Image</h2>
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
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
