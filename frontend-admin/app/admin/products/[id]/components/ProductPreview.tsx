/**
 * Product Preview Component
 * Uses the EXACT same design as the customer-facing store
 * Fully mobile responsive
 */

'use client';

import { useState } from 'react';

interface ProductPreviewProps {
    product: any;
    onEdit: () => void;
}

export function ProductPreview({ product, onEdit }: ProductPreviewProps) {
    // Transform admin product data to match store format
    const productDetail = {
        id: product.id,
        title: product.name,
        subtitle: product.description || '',
        description: product.description || '',
        image: product.images?.[0]?.url || '',
        images: product.images?.map((img: any) => img.url) || [],
        price: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        sizes: product.variants?.map((v: any) => v.size) || ['S', 'M', 'L', 'XL'],
        variants: product.variants || [],
        vendor: 'HumanTee',
        productType: product.category || 'T-Shirt',
        details: [],
    };

    return (
        <div className="min-h-screen brand-bg-dusk">
            {/* Back Button */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6">
                <button
                    onClick={() => window.history.back()}
                    className="text-xs sm:text-sm text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Product Page - EXACT same layout as store */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-8 pt-4 sm:pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-start">

                    {/* Image Gallery */}
                    <ProductImageGalleryPreview
                        images={productDetail.images}
                        title={productDetail.title}
                    />

                    {/* Product Info */}
                    <ProductInfoPreview product={productDetail} onEdit={onEdit} />

                </div>
            </div>
        </div>
    );
}

// Image Gallery Component
function ProductImageGalleryPreview({ images, title }: any) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
                {images.length > 0 ? (
                    <img
                        src={images[selectedImage]}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl">
                        👕
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image: string, index: number) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                ? 'border-violet-400'
                                : 'border-white/10 hover:border-white/30'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${title} ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Product Info Component
function ProductInfoPreview({ product, onEdit }: any) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Title & Subtitle */}
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2">
                    {product.title}
                </h1>
                {product.subtitle && (
                    <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                        {product.subtitle}
                    </p>
                )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    ₹{product.price}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-base sm:text-lg text-white/40 line-through">
                        ₹{product.compareAtPrice}
                    </span>
                )}
            </div>

            {/* Size Selector with Stock */}
            {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                    <label className="block text-white/70 text-[10px] sm:text-xs uppercase tracking-wider font-medium">
                        Select Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {product.variants.map((variant: any) => {
                            // Handle different possible field names for stock
                            const stockQty = variant.stockQuantity ?? variant.stock ?? variant.quantity ?? 0;
                            const isOutOfStock = stockQty === 0;
                            const isSelected = selectedSize === variant.size;

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedSize(variant.size)}
                                    disabled={isOutOfStock}
                                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all relative ${isOutOfStock
                                        ? 'border-white/5 text-white/20 cursor-not-allowed bg-white/5'
                                        : isSelected
                                            ? 'border-violet-400 bg-violet-400/10 text-white'
                                            : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-0.5">
                                        <span>{variant.size}</span>
                                        <span className={`text-[9px] sm:text-[10px] ${isOutOfStock
                                            ? 'text-red-400/60'
                                            : 'text-white/40'
                                            }`}>
                                            {isOutOfStock ? 'Out' : stockQty}
                                        </span>
                                    </div>
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-px bg-white/20 rotate-[-20deg]"></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Total Stock Info */}
                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                        <span className="text-white/50">Total Stock</span>
                        <span className={`font-semibold ${product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity ?? v.stock ?? v.quantity ?? 0), 0) > 0
                            ? 'text-green-400'
                            : 'text-red-400'
                            }`}>
                            {product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity ?? v.stock ?? v.quantity ?? 0), 0)} units
                        </span>
                    </div>
                </div>
            )}

            {/* Edit Product Button */}
            <button
                onClick={onEdit}
                className="w-full bg-white hover:bg-gray-100 text-black px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Product
            </button>

            {/* Description */}
            {product.description && (
                <div className="pt-4 sm:pt-6 border-t border-white/10">
                    <h3 className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold mb-3 sm:mb-4">
                        The Narrative
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                        {product.description}
                    </p>
                </div>
            )}

            {/* Product Details */}
            <div className="pt-4 sm:pt-6 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-white/50">Category</span>
                    <span className="text-white/80">{product.productType}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-white/50">Vendor</span>
                    <span className="text-white/80">{product.vendor}</span>
                </div>
            </div>
        </div>
    );
}
