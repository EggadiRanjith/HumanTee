/**
 * Order Items Component
 * Displays list of items in the order
 */

import Link from 'next/link';
import { useLoading } from '@/app/contexts/LoadingContext';
import { OrderItem } from '../../types';

interface OrderItemsProps {
    items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
    const { setLoading } = useLoading();

    return (
        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl luxury-glass border border-white/10 bg-white/5"
                >
                    <Link href={`/product/${item.productId}`} onClick={() => setLoading(true)} className="flex-shrink-0">
                        <img
                            src={item.imageUrlSnapshot || '/placeholder.png'}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
                            alt={item.productNameSnapshot}
                        />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.productId}`} onClick={() => setLoading(true)} className="hover:underline block">
                            <h4 className="text-white text-xs sm:text-sm tracking-wide truncate">{item.productNameSnapshot}</h4>
                        </Link>
                        <p className="text-white/60 text-[10px] sm:text-xs mt-1 truncate">Size: {item.variantLabelSnapshot}</p>

                        <p className="text-white/70 text-[10px] sm:text-xs mt-1">
                            ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                        </p>

                        <p className="text-white text-sm font-light mt-1.5 sm:mt-2">
                            ₹{Number(item.lineTotal).toFixed(2)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
