/**
 * Products List Page (PRODUCTION-GRADE)
 * Features: Search, filters, sorting, responsive layout
 * Mobile: Card grid | Desktop: Table view
 */

'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useAdminProducts } from '@/lib/queries/useProducts';
import { ProductsHeader, ProductsSkeleton, ProductsEmpty, ProductsError } from './components';
import { useProductFilters } from './hooks';
import { FiPlus, FiSearch, FiPackage, FiAlertCircle, FiEdit2, FiLoader } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';

type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [status, setStatus] = useState<ProductStatus | 'ALL'>('ALL');
    const [category, setCategory] = useState('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Use React Query hook
    const { data, isLoading, error, refetch } = useAdminProducts({
        status: status !== 'ALL' ? status : undefined,
        search: debouncedSearch || undefined,
    });

    const products = data || [];

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Search
        if (searchQuery) {
            filtered = filtered.filter(
                (p: any) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (status !== 'ALL') {
            filtered = filtered.filter((p: any) => p.status === status);
        }

        // Category filter
        if (category !== 'ALL') {
            filtered = filtered.filter((p: any) => p.category === category);
        }

        // Sort
        filtered = filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'price') {
                comparison = Number(a.basePrice) - Number(b.basePrice);
            } else if (sortBy === 'stock') {
                const aStock = a.variants?.reduce((sum: number, v) => sum + (v.stock || 0), 0) || a.stock || 0;
                const bStock = b.variants?.reduce((sum: number, v) => sum + (v.stock || 0), 0) || b.stock || 0;
                comparison = aStock - bStock;
            } else {
                comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [products, searchQuery, status, category, sortBy, sortOrder]);

    // Paginated products
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, status, category]);

    // Loading state
    if (isLoading) return <ProductsSkeleton />;

    // Error state
    if (error) return <ProductsError error={error} onRetry={() => refetch()} />;

    // Empty state - only show when NO products exist at all
    if (products.length === 0) {
        return <ProductsEmpty />;
    }

    // No results state - show when filters return empty
    const showNoResults = filteredProducts.length === 0;

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
        <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Header */}
            <ProductsHeader />

            {/* Filters & Search - Compact Mobile */}
            <div className="bg-white rounded-lg border border-gray-200 p-2.5 md:p-3 lg:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e: any) => setStatus(e.target.value as ProductStatus | 'ALL')}
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Drop 1">Drop 1</option>
                        <option value="Drop 2">Drop 2</option>
                        <option value="Drop 3">Drop 3</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e: any) => {
                            const [sort, order] = e.target.value.split('-');
                            setSortBy(sort as typeof sortBy);
                            setSortOrder(order as typeof sortOrder);
                        }}
                        className="px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
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

            {/* No Results State */}
            {showNoResults && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                        Try adjusting your filters or search query
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setStatus('ALL');
                            setCategory('ALL');
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Products Grid (Mobile) - Compact */}
            {!showNoResults && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:hidden gap-2.5 md:gap-3 lg:gap-4">
                    {paginatedProducts.map((product) => (
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
                                    <div className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl">
                                        👕
                                    </div>
                                )}
                                {product.isFeatured && (
                                    <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 bg-black text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-medium">
                                        Featured
                                    </div>
                                )}
                                {product.stock === 0 && (
                                    <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-red-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-medium">
                                        Out of Stock
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-2 md:p-3">
                                <div className="flex items-start justify-between gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                    <h3 className="font-medium text-xs md:text-sm text-black line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <span
                                        className={`px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs font-medium rounded flex-shrink-0 ${getStatusColor(
                                            product.status as ProductStatus
                                        )}`}
                                    >
                                        {product.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs md:text-sm">
                                    <div>
                                        <div className="font-semibold text-black">₹{product.basePrice}</div>
                                        {product.compareAtPrice && (
                                            <div className="text-[10px] md:text-xs text-gray-500 line-through">
                                                ₹{product.compareAtPrice}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-gray-600">Stock: {product.stock}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Products Table (Desktop) */}
            {!showNoResults && (
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
                            {paginatedProducts.map((product) => (
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
            )}

            {/* Pagination - Compact Mobile */}
            {!showNoResults && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border border-gray-200 p-2.5 md:p-4 gap-3 sm:gap-0">
                    <div className="text-xs md:text-sm text-gray-600 hidden sm:block">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 md:px-3 py-1 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">←</span>
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-2.5 md:px-3 py-1 border rounded-lg text-xs md:text-sm ${currentPage === page
                                        ? 'bg-black text-white border-black'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2.5 md:px-3 py-1 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
