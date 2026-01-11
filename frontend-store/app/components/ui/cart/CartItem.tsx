/**
 * Cart Item Component
 * Individual cart item with image, details, quantity controls, and remove button
 */

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useState } from 'react';

interface CartItemType {
    id: number | string;
    title: string;
    price: number;
    currency: string;
    image: string;
    size?: string;
    quantity: number;
    availableStock?: number;
}

interface CartItemProps {
    item: CartItemType;
    index: number;
    onUpdateQuantity: (id: number | string, size: string, quantity: number) => void;
    onRemove: (id: number | string, size?: string) => void;
}

export function CartItem({ item, index, onUpdateQuantity, onRemove }: CartItemProps) {
    const lineTotal = item.price * item.quantity;
    const [stockError, setStockError] = useState<string | null>(null);

    const handleQuantityChange = (newQuantity: number) => {
        // Check stock before updating
        if (item.availableStock !== undefined && newQuantity > item.availableStock) {
            setStockError(`Only ${item.availableStock} items available`);
            setTimeout(() => setStockError(null), 3000);
            return;
        }

        setStockError(null);
        onUpdateQuantity(item.id, item.size || '', newQuantity);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="
                relative isolate
                p-3 sm:p-4 rounded-xl sm:rounded-2xl luxury-glass
                border border-white/10 bg-white/5 backdrop-blur-xl
                overflow-hidden
            "
        >
            <div className="flex gap-3 sm:gap-4">
                {/* Image */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                        src={item.image || '/images/placeholder.webp'}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                        className="object-cover"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Title and Size */}
                    <div className="min-w-0">
                        <Link href={`/product/${item.id}`}>
                            <h3 className="text-[12px] sm:text-[13px] font-light tracking-wide hover:text-brand-secondary transition-colors truncate">
                                {item.title}
                            </h3>
                        </Link>
                        {item.size && (
                            <p className="text-white/50 text-[12px] mt-0.5 sm:mt-1">
                                Size: <span className="text-white/70">{item.size}</span>
                            </p>
                        )}
                    </div>

                    {/* Stock Error Message */}
                    {stockError && (
                        <div className="mt-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/30">
                            <p className="text-red-400 text-[10px] sm:text-xs">
                                {stockError}
                            </p>
                        </div>
                    )}

                    {/* Quantity Controls and Price Row */}
                    <div className="flex items-center justify-between gap-3 sm:gap-4 mt-2 sm:mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <button
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="
                                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg luxury-glass border border-white/10
                                    text-white/70 hover:text-white hover:bg-white/10
                                    transition-colors flex items-center justify-center flex-shrink-0
                                "
                            >
                                <FiMinus size={14} />
                            </button>

                            <span className="text-white text-[12px] sm:text-[13px] font-light min-w-[1.5rem] text-center">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="
                                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg luxury-glass border border-white/10
                                    text-white/70 hover:text-white hover:bg-white/10
                                    transition-colors flex items-center justify-center flex-shrink-0
                                "
                            >
                                <FiPlus size={14} />
                            </button>
                        </div>

                        {/* Price - Right Side */}
                        <div className="flex flex-col items-end text-right flex-shrink-0">
                            <p className="text-white text-[12px] sm:text-[13px] font-light whitespace-nowrap">
                                {item.currency} {lineTotal.toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                                <p className="text-yellow-400/80 text-[10px] font-light whitespace-nowrap">
                                    ({item.currency} {item.price.toFixed(2)} each)
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => onRemove(item.id, item.size)}
                    aria-label={`Remove ${item.title} from cart`}
                    className="
                        self-start p-2 rounded-lg flex-shrink-0
                        text-white/40 hover:text-red-400 hover:bg-red-500/10
                        transition-colors w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
                    "
                >
                    <FiTrash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
}
