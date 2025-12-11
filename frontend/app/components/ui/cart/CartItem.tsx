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
    id: number;
    title: string;
    subtitle: string;
    price: string;
    image: string;
    size?: string;
    quantity: number;
}

interface CartItemProps {
    item: CartItemType;
    index: number;
    onUpdateQuantity: (id: number, size: string, quantity: number) => void;
    onRemove: (id: number, size?: string) => void;
}

export function CartItem({ item, index, onUpdateQuantity, onRemove }: CartItemProps) {
    const lineTotal = parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="
        p-4 sm:p-6 rounded-2xl luxury-glass
        border border-white/10 bg-white/5 backdrop-blur-xl
        flex gap-4 sm:gap-6
      "
        >
            {/* Image */}
            <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <Link href={`/product/${item.id}`}>
                        <h3 className="text-white text-base sm:text-lg font-light tracking-wide hover:text-brand-secondary transition-colors">
                            {item.title}
                        </h3>
                    </Link>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                        {item.subtitle}
                    </p>
                    {item.size && (
                        <p className="text-white/50 text-xs mt-1">
                            Size: <span className="text-white/70">{item.size}</span>
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-start mt-4 gap-6 sm:gap-10">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.size || '', item.quantity - 1)}
                            className="
                w-8 h-8 rounded-lg luxury-glass border border-white/10
                text-white/70 hover:text-white hover:bg-white/10
                transition-colors flex items-center justify-center
              "
                        >
                            <FiMinus size={14} />
                        </button>

                        <span className="text-white text-sm font-light min-w-[2rem] text-center">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => onUpdateQuantity(item.id, item.size || '', item.quantity + 1)}
                            className="
                w-8 h-8 rounded-lg luxury-glass border border-white/10
                text-white/70 hover:text-white hover:bg-white/10
                transition-colors flex items-center justify-center
              "
                        >
                            <FiPlus size={14} />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 text-left">
                        <p className="text-white text-base sm:text-lg font-light">
                            ₹ {lineTotal.toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                            <p className="text-yellow-400/80 text-xs sm:text-sm font-light">
                                ({item.price} each)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => onRemove(item.id, item.size)}
                className="
          self-start p-2 rounded-lg
          text-white/40 hover:text-red-400 hover:bg-red-500/10
          transition-colors
        "
            >
                <FiTrash2 size={18} />
            </button>
        </motion.div>
    );
}
