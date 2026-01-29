/**
 * Cart Item Component
 * Individual cart item with image, details, quantity controls, and remove button
 */

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiLoader } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useLoading } from '@/app/contexts/LoadingContext';

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
    onUpdateQuantity: (id: number | string, size: string, quantity: number) => Promise<void>;
    onRemove: (id: number | string, size?: string) => void;
}

export function CartItem({ item, index, onUpdateQuantity, onRemove }: CartItemProps) {
    const { setLoading } = useLoading();
    const lineTotal = item.price * item.quantity;
    const [stockError, setStockError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingDirection, setUpdatingDirection] = useState<'increment' | 'decrement' | null>(null);
    const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestIdRef = useRef<number>(0); // Track active request

    const handleQuantityChange = (newQuantity: number, direction: 'increment' | 'decrement') => {
        // Block if already updating (API call in progress)
        if (isUpdating) return;

        // Maximum quantity limit per item
        const MAX_QUANTITY = 6;
        if (newQuantity > MAX_QUANTITY) {
            setStockError(`Maximum ${MAX_QUANTITY} items allowed per product`);
            setTimeout(() => setStockError(null), 3000);
            return;
        }

        // Check stock before updating
        if (item.availableStock !== undefined && newQuantity > item.availableStock) {
            setStockError(`Only ${item.availableStock} items available`);
            setTimeout(() => setStockError(null), 3000);
            return;
        }

        setStockError(null);
        setPendingQuantity(newQuantity); // Show new quantity immediately (optimistic UI)
        setIsUpdating(true); // Show spinner immediately
        setUpdatingDirection(direction); // Track which button was clicked

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Increment request ID for this new request
        const currentRequestId = ++requestIdRef.current;

        // Set new timer - send request after 300ms of no clicks
        debounceTimerRef.current = setTimeout(async () => {
            try {
                await onUpdateQuantity(item.id, item.size || '', newQuantity);
            } finally {
                // Only clear spinner if this is still the active request
                if (currentRequestId === requestIdRef.current) {
                    setIsUpdating(false);
                    setUpdatingDirection(null);
                    setPendingQuantity(null);
                }
            }
        }, 300);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const displayQuantity = pendingQuantity ?? item.quantity;

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
                        <Link href={`/product/${item.id}`} onClick={() => setLoading(true)}>
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
                                onClick={() => handleQuantityChange(item.quantity - 1, 'decrement')}
                                disabled={isUpdating}
                                aria-label="Decrease quantity"
                                className="
                                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg luxury-glass border border-white/10
                                    text-white/70 hover:text-white hover:bg-white/10
                                    transition-colors flex items-center justify-center flex-shrink-0
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                            >
                                {isUpdating && updatingDirection === 'decrement' ? (
                                    <FiLoader size={14} className="animate-spin" />
                                ) : (
                                    <FiMinus size={14} />
                                )}
                            </button>

                            <span className="text-white text-[12px] sm:text-[13px] font-light min-w-[1.5rem] text-center">
                                {displayQuantity}
                            </span>

                            <button
                                onClick={() => handleQuantityChange(item.quantity + 1, 'increment')}
                                disabled={isUpdating}
                                aria-label="Increase quantity"
                                className="
                                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg luxury-glass border border-white/10
                                    text-white/70 hover:text-white hover:bg-white/10
                                    transition-colors flex items-center justify-center flex-shrink-0
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                            >
                                {isUpdating && updatingDirection === 'increment' ? (
                                    <FiLoader size={14} className="animate-spin" />
                                ) : (
                                    <FiPlus size={14} />
                                )}
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
