/**
 * Product Info
 * Client component island for product interactivity
 */

"use client";

import dynamic from "next/dynamic";
import { logError } from '@/lib/logger';
import { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/contexts/CartContext';
import { useToast } from '@/app/contexts/ToastContext';
import { ProductDetail } from '@/app/types/product.types';
import { Badge, StockIndicator } from '@/app/components/ui/primitives';
import { SizeSelector } from './SizeSelector';
import { QuantitySelector } from './QuantitySelector';
import { ProductDetails } from './ProductDetails';
import { SizeGuide } from '@/app/components/ui/modals/SizeGuide';
import { FiInfo } from 'react-icons/fi';
import { useSectionSettings } from "@/app/hooks/useSettings";

// Dynamic import to prevent SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface ProductInfoProps {
    product: ProductDetail;
}

interface ProductSettings {
    material_care?: string[];
    shipping_returns?: string[];
    size_fit?: string[];
}

const ProductInfoComponent = ({ product }: ProductInfoProps) => {
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState(false);
    const [stockError, setStockError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [cartAnimation, setCartAnimation] = useState<object | null>(null);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const { addToCart, getItemInCart } = useCart();
    const { showToast } = useToast();

    // Get product-info settings from centralized cache
    const { settings: pageSettings } = useSectionSettings('product-info');

    // Extract settings with proper typing
    const productSettings: ProductSettings = pageSettings || {
        material_care: [],
        shipping_returns: [],
        size_fit: []
    };

    // Fetch Lottie JSON on mount
    useEffect(() => {
        fetch('/animation/lottie/shopping/add_to_cart.json')
            .then(res => res.json())
            .then(data => setCartAnimation(data))
            .catch(err => logError(err, "Failed to load Lottie animation"));
    }, []);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setSizeError(true);
            setStockError("Please select a size before adding to cart");
            setTimeout(() => setSizeError(false), 3000);
            return;
        }

        // Find the variant for the selected size
        const selectedVariant = product.variants?.find((v: any) => v.size === selectedSize);

        if (!selectedVariant) {
            setStockError(`Variant for size ${selectedSize} not found`);
            return;
        }

        setIsLoading(true);
        setStockError(null);

        const success = await addToCart(
            {
                id: product.id,
                title: product.title,
                price: product.price,
                currency: product.currency,
                image: product.images[0],
                size: selectedSize,
                quantity,
                availableStock: selectedVariant.stockQuantity || product.stock,
                variantId: selectedVariant.id, // ✅ Use actual variant ID!
            },
            () => {
                // Success callback - show inline message
                setAddedToCart(true);
                setStockError(null);
                setTimeout(() => {
                    setAddedToCart(false);
                }, 3000);
            },
            (error) => {
                // Error callback - show inline instead of toast
                setStockError(error);
            }
        );

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8">

            {/* Title */}
            <div className="space-y-1">
                <h1 className="text-white text-[1.7rem] sm:text-[2.2rem] lg:text-[2.6rem] font-light tracking-wide leading-tight">
                    {product.title}
                </h1>
                {(product.vendor || product.productType) && (
                    <p className="text-white/60 text-[0.85rem] sm:text-[0.95rem] tracking-wide">
                        {product.vendor && product.productType ? `${product.vendor} • ${product.productType}` : product.vendor || product.productType}
                    </p>
                )}
            </div>

            {/* Price + Badge + Stock */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    {product.originalPrice && (
                        <div className="text-white/40 text-[1.2rem] sm:text-[1.4rem] line-through">
                            {product.currency} {product.originalPrice.toFixed(2)}
                        </div>
                    )}
                    <div className="text-white text-[1.6rem] sm:text-[2rem] font-light tracking-wide">
                        {product.currency} {product.price.toFixed(2)}
                    </div>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="inline-block px-3 py-1 text-[0.75rem] sm:text-[0.85rem] font-bold tracking-wider uppercase bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white rounded-full shadow-glow-violet-medium">
                        Save {product.currency} {(product.originalPrice - product.price).toFixed(2)}
                    </div>
                )}
                {product.badge && (
                    <Badge variant={product.badge} />
                )}
                <StockIndicator stock={product.stock} />
            </div>

            {/* Size Selector with Guide */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-white/70 text-sm">Select Size</label>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowSizeGuide(true);
                        }}
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                    >
                        <FiInfo className="w-4 h-4" />
                        <span>Size Guide</span>
                    </button>
                </div>
                <SizeSelector
                    sizes={product.sizes}
                    selected={selectedSize}
                    onChange={setSelectedSize}
                    error={sizeError}
                />
                {/* Stock Info */}
                <p className="text-white/50 text-xs">
                    {product.stock} {product.stock === 1 ? 'item' : 'items'} in stock (all sizes)
                </p>
            </div>

            {/* Quantity Selector */}
            <QuantitySelector
                value={quantity}
                onChange={setQuantity}
            />

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">


                {/* Stock Error Message */}
                {stockError && (
                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-red-400 text-sm font-medium text-center">
                            {stockError}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={addedToCart || isLoading}
                    className={`
            w-full py-3.5 sm:py-4 
            rounded-full transition-colors duration-300
            text-[0.8rem] uppercase tracking-[0.18em] font-medium
            border border-transparent
            hover:shadow-lg
            relative overflow-hidden
            flex items-center justify-center gap-2
            ${addedToCart
                            ? 'bg-zinc-800 text-white/50 cursor-not-allowed'
                            : stockError
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : isLoading
                                    ? 'bg-white/70 text-black/50'
                                    : 'bg-white text-black hover:bg-white/90'
                        }
          `}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            <span>ADDING...</span>
                        </div>
                    ) : addedToCart && cartAnimation ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-10 h-10 -my-2 transform scale-125">
                                <Lottie
                                    animationData={cartAnimation}
                                    loop={false}
                                    autoplay={true}
                                />
                            </div>
                            <span>ADDED TO CART</span>
                        </div>
                    ) : (
                        <span>ADD TO CART</span>
                    )}
                </button>

                <Link
                    href="/cart"
                    className="
            w-full py-3.5 sm:py-4 
            rounded-full transition-all duration-300
            text-[0.8rem] uppercase tracking-[0.18em] font-medium
            border-2 border-white/20 text-white
            hover:bg-white/5 hover:border-white/30
            flex items-center justify-center
          "
                >
                    Go to Cart
                </Link>
            </div>

            {/* Description & Details */}
            <ProductDetails
                description={product.description}
                details={product.details}
                pageSettings={productSettings}
            />

            {/* Size Guide Modal */}
            <SizeGuide
                isOpen={showSizeGuide}
                onClose={() => setShowSizeGuide(false)}
            />

        </div>
    );
}

export const ProductInfo = memo(ProductInfoComponent);
