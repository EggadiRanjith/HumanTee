/**
 * Order Items Component
 * Displays list of items in the order
 */

import Link from 'next/link';
import { OrderItem } from '../../types';

interface OrderItemsProps {
    items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
    return (
        <div className="space-y-4 mb-12">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl luxury-glass border border-white/10 bg-white/5"
                >
                    <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                        <img
                            src={item.imageUrlSnapshot || '/placeholder.png'}
                            className="w-20 h-20 rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
                            alt={item.productNameSnapshot}
                        />
                    </Link>
                    <div className="flex-1">
                        <Link href={`/product/${item.productId}`} className="hover:underline">
                            <h4 className="text-white text-sm tracking-wide">{item.productNameSnapshot}</h4>
                        </Link>
                        <p className="text-white/60 text-xs mt-1">Size: {item.variantLabelSnapshot}</p>

                        <p className="text-white/70 text-xs mt-1">
                            ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                        </p>

                        <p className="text-white text-sm font-light mt-2">
                            ₹{Number(item.lineTotal).toFixed(2)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
