/**
 * Cart Item Component
 * Individual cart item with image, details, quantity controls, and remove button
 */

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

interface CartItemType {
    id: number | string;
    title: string;
    price: number;
    currency: string;
    image: string;
    size?: string;
    quantity: number;
}

interface CartItemProps {
    item: CartItemType;
    index: number;
    onUpdateQuantity: (id: number | string, size: string, quantity: number) => void;
    onRemove: (id: number | string, size?: string) => void;
}

export function CartItem({ item, index, onUpdateQuantity, onRemove }: CartItemProps) {
    const lineTotal = item.price * item.quantity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="
        relative isolate
        p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl luxury-glass
        border border-white/10 bg-white/5 backdrop-blur-xl
        overflow-hidden
      "
        >
            <div className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-6">
                {/* Image */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                        className="object-cover"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 overflow-hidden flex flex-col justify-between">
                    {/* Title and Size */}
                    <div className="min-w-0 overflow-hidden">
                        <Link href={`/product/${item.id}`}>
                            <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-wide hover:text-brand-secondary transition-colors truncate">
                                {item.title}
                            </h3>
                        </Link>
                        {item.size && (
                            <p className="text-white/50 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                                Size: <span className="text-white/70">{item.size}</span>
                            </p>
                        )}
                    </div>

                    {/* Quantity Controls and Price Row */}
                    <div className="flex items-center justify-between gap-2 sm:gap-3 mt-2 sm:mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.size || '', item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="
                    w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg luxury-glass border border-white/10
                    text-white/70 hover:text-white hover:bg-white/10
                    transition-colors flex items-center justify-center flex-shrink-0
                  "
                            >
                                <FiMinus size={12} className="sm:w-[14px] sm:h-[14px] md:w-4 md:h-4" />
                            </button>

                            <span className="text-white text-xs sm:text-sm font-light min-w-[1.25rem] sm:min-w-[1.5rem] md:min-w-[2rem] text-center">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() => onUpdateQuantity(item.id, item.size || '', item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="
                    w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg luxury-glass border border-white/10
                    text-white/70 hover:text-white hover:bg-white/10
                    transition-colors flex items-center justify-center flex-shrink-0
                  "
                            >
                                <FiPlus size={12} className="sm:w-[14px] sm:h-[14px] md:w-4 md:h-4" />
                            </button>
                        </div>

                        {/* Price - Right Side */}
                        <div className="flex flex-col items-end text-right flex-shrink-0 min-w-0">
                            <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light whitespace-nowrap">
                                {item.currency} {lineTotal.toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                                <p className="text-yellow-400/80 text-[9px] sm:text-[10px] md:text-xs font-light whitespace-nowrap">
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
              self-start p-1.5 sm:p-2 rounded-lg flex-shrink-0
              text-white/40 hover:text-red-400 hover:bg-red-500/10
              transition-colors min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center
            "
                >
                    <FiTrash2 size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                </button>
            </div>
        </motion.div>
    );
}
