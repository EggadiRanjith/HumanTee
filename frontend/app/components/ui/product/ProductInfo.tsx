/**
 * Product Info
 * Client component island for product interactivity
 */

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/components/context/CartContext';
import { ProductDetail } from '@/app/types/product.types';
import { Badge, StockIndicator } from '@/app/components/ui/primitives';
import { SizeSelector } from './SizeSelector';
import { QuantitySelector } from './QuantitySelector';
import { ProductDetails } from './ProductDetails';

// Dynamic import to prevent SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface ProductInfoProps {
    product: ProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [cartAnimation, setCartAnimation] = useState<any>(null); // State for Lottie JSON
    const { addToCart } = useCart();

    // Fetch Lottie JSON on mount
    useEffect(() => {
        fetch('/animation/lottie/shopping/add_to_cart.json')
            .then(res => res.json())
            .then(data => setCartAnimation(data))
            .catch(err => console.error("Failed to load Lottie animation", err));
    }, []);

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 3000);
            return;
        }

        setSizeError(false);

        addToCart({
            id: product.id,
            title: product.title,
            subtitle: product.subtitle,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: quantity,
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2600); // Extended for animation to play out
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8">

            {/* Title */}
            <div className="space-y-1">
                <h1 className="text-white text-[1.7rem] sm:text-[2.2rem] lg:text-[2.6rem] font-light tracking-wide leading-tight">
                    {product.title}
                </h1>
                <p className="text-white/60 text-[0.85rem] sm:text-[0.95rem] tracking-wide">
                    {product.subtitle}
                </p>
            </div>

            {/* Price + Badge + Stock */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="text-white text-[1.6rem] sm:text-[2rem] font-light tracking-wide">
                    {product.price}
                </div>
                {product.originalPrice && (
                    <div className="text-white/40 text-[1.2rem] line-through">
                        {product.originalPrice}
                    </div>
                )}
                {product.badge && (
                    <Badge variant={product.badge} />
                )}
                <StockIndicator stock={product.stock} />
            </div>

            {/* Size Selector */}
            <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
                error={sizeError}
            />

            {/* Quantity Selector */}
            <QuantitySelector
                value={quantity}
                onChange={setQuantity}
            />

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
                <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`
            w-full py-3.5 sm:py-4 
            rounded-full transition-colors duration-300
            text-[0.8rem] uppercase tracking-[0.18em] font-medium
            border border-transparent
            hover:shadow-lg
            relative overflow-hidden
            flex items-center justify-center gap-2
            ${addedToCart ? 'bg-[#22c55e] text-white pointer-events-none' : 'bg-white text-black hover:bg-white/90'}
          `}
                >
                    {addedToCart && cartAnimation ? (
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
            />

        </div>
    );
}
