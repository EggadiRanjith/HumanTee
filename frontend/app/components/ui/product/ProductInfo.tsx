/**
 * Product Info
 * Client component island for product interactivity
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/components/context/CartContext';
import { ProductDetail } from '@/app/types/product.types';
import { Badge, StockIndicator } from '@/app/components/ui/primitives';
import { SizeSelector } from './SizeSelector';
import { QuantitySelector } from './QuantitySelector';
import { ProductDetails } from './ProductDetails';

interface ProductInfoProps {
    product: ProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

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
        setTimeout(() => setAddedToCart(false), 2000);
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
                    className={`
            w-full py-3.5 sm:py-4 
            rounded-full transition-all duration-300
            text-[0.8rem] uppercase tracking-[0.18em] font-medium
            ${addedToCart
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-black hover:bg-white/90'
                        }
          `}
                >
                    {addedToCart ? "Added to Cart" : "Add to Cart"}
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
