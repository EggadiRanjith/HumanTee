/**
 * Products List Page (PRODUCTION-GRADE)
 * Features: Search, filters, sorting, responsive layout
 * Mobile: Card grid | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { getAllProducts, type ProductResponse } from '@/lib/api/products';

type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const data = await getAllProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError(err instanceof Error ? err.message : 'Failed to load products');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Search
        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((p) => p.status === statusFilter);
        }

        // Category filter
        if (categoryFilter !== 'ALL') {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = (a.basePrice || 0) - (b.basePrice || 0);
                    break;
                case 'stock':
                    comparison = (a.stock || 0) - (b.stock || 0);
                    break;
                case 'date':
                    // Convert potential string dates to Date objects
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    comparison = dateA - dateB;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [products, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

    const getStatusColor = (status: ProductStatus) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700';
            case 'DRAFT':
                return 'bg-gray-100 text-gray-700';
            case 'ARCHIVED':
                return 'bg-red-100 text-red-700';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">Products</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {filteredProducts.length} of {products.length} products
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm text-center"
                >
                    + Add Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'ALL')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Drop 1">Drop 1</option>
                        <option value="Drop 2">Drop 2</option>
                        <option value="Drop 3">Drop 3</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [sort, order] = e.target.value.split('-');
                            setSortBy(sort as typeof sortBy);
                            setSortOrder(order as typeof sortOrder);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="price-asc">Price (Low-High)</option>
                        <option value="price-desc">Price (High-Low)</option>
                        <option value="stock-asc">Stock (Low-High)</option>
                        <option value="stock-desc">Stock (High-Low)</option>
                    </select>
                </div>
            </div>

            {/* Products Grid (Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                    <Link
                        key={product.id}
                        href={`/admin/products/${product.id}`}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Image */}
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={(product.images.find(img => img.isPrimary) || product.images[0]).url}
                                    alt={(product.images.find(img => img.isPrimary) || product.images[0]).altText || product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                    👕
                                </div>
                            )}
                            {product.isFeatured && (
                                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded font-medium">
                                    Featured
                                </div>
                            )}
                            {product.stock === 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                                    Out of Stock
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-medium text-sm text-black line-clamp-2">
                                    {product.name}
                                </h3>
                                <span
                                    className={`px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 ${getStatusColor(
                                        product.status as ProductStatus
                                    )}`}
                                >
                                    {product.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <div className="font-semibold text-black">₹{product.basePrice}</div>
                                    {product.compareAtPrice && (
                                        <div className="text-xs text-gray-500 line-through">
                                            ₹{product.compareAtPrice}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">Stock: {product.stock}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Products Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Image
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Product
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Price
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Stock
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Category
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={(product.images.find(img => img.isPrimary) || product.images[0]).url}
                                                alt={(product.images.find(img => img.isPrimary) || product.images[0]).altText || product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg">👕</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-sm text-black">
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500">{product.slug}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                            product.status as ProductStatus
                                        )}`}
                                    >
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">₹{product.basePrice}</div>
                                    {product.compareAtPrice && (
                                        <div className="text-xs text-gray-500 line-through">
                                            ₹{product.compareAtPrice}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div
                                        className={`text-sm ${product.stock === 0
                                            ? 'text-red-600 font-medium'
                                            : product.stock < 10
                                                ? 'text-orange-600'
                                                : 'text-gray-900'
                                            }`}
                                    >
                                        {product.stock} units
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="text-sm text-black hover:underline font-medium"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-black mb-2">No products found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Try adjusting your search or filters
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
                            setCategoryFilter('ALL');
                        }}
                        className="text-sm text-black hover:underline font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
