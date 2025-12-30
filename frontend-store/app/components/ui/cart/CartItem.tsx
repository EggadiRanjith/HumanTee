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
        p-4 sm:p-6 rounded-2xl luxury-glass
        border border-white/10 bg-white/5 backdrop-blur-xl
        flex gap-3 sm:gap-4 lg:gap-6
      "
        >
            {/* Image */}
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                <Image
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
                    className="object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="min-w-0">
                    <Link href={`/product/${item.id}`}>
                        <h3 className="text-white text-sm sm:text-base lg:text-lg font-light tracking-wide hover:text-brand-secondary transition-colors truncate">
                            {item.title}
                        </h3>
                    </Link>
                    {item.size && (
                        <p className="text-white/50 text-xs mt-1">
                            Size: <span className="text-white/70">{item.size}</span>
                        </p>
                    )}
                </div>

                {/* Controls - Responsive Layout */}
                <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.size || '', item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="
                w-11 h-11 sm:w-12 sm:h-12 rounded-lg luxury-glass border border-white/10
                text-white/70 hover:text-white hover:bg-white/10
                transition-colors flex items-center justify-center flex-shrink-0
              "
                        >
                            <FiMinus size={14} className="sm:w-4 sm:h-4" />
                        </button>

                        <span className="text-white text-sm font-light min-w-[1.5rem] sm:min-w-[2rem] text-center">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => onUpdateQuantity(item.id, item.size || '', item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="
                w-11 h-11 sm:w-12 sm:h-12 rounded-lg luxury-glass border border-white/10
                text-white/70 hover:text-white hover:bg-white/10
                transition-colors flex items-center justify-center flex-shrink-0
              "
                        >
                            <FiPlus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                    </div>

                    {/* Price - Flexible */}
                    <div className="flex flex-col items-end text-right min-w-0">
                        <p className="text-white text-sm sm:text-base lg:text-lg font-light whitespace-nowrap">
                            {item.currency} {lineTotal.toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                            <p className="text-yellow-400/80 text-[10px] sm:text-xs font-light whitespace-nowrap">
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
          transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center
        "
            >
                <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
        </motion.div>
    );
}
