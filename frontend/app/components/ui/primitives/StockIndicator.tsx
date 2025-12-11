/**
 * StockIndicator Component
 * Animated stock status indicator with pulse effect
 * Color-coded based on stock levels (low, limited, in-stock)
 * 
 * @example
 * <StockIndicator stock={5} />
 * <StockIndicator stock={10} showCount={false} />
 */

import { useMemo } from 'react';
import { STOCK_THRESHOLDS } from '@/app/constants/styles.constants';
import { StockInfo } from '@/app/types/product.types';

interface StockIndicatorProps {
    stock: number;
    showCount?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function StockIndicator({
    stock,
    showCount = true,
    size = 'sm',
    className = ''
}: StockIndicatorProps) {
    const stockInfo: StockInfo = useMemo(() => {
        if (stock <= STOCK_THRESHOLDS.LOW) {
            return {
                level: 'low',
                count: stock,
                label: 'Low Stock',
                dotColor: 'bg-red-400/70',
                textColor: 'text-red-400/80',
            };
        } else if (stock <= STOCK_THRESHOLDS.LIMITED) {
            return {
                level: 'limited',
                count: stock,
                label: 'Limited Stock',
                dotColor: 'bg-amber-400/70',
                textColor: 'text-amber-400/80',
            };
        } else {
            return {
                level: 'in-stock',
                count: stock,
                label: 'In Stock',
                dotColor: 'bg-emerald-400/70',
                textColor: 'text-emerald-400/80',
            };
        }
    }, [stock]);

    const dotSize = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    }[size];

    return (
        <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite">
            <div className="relative">
                <div className={`${dotSize} rounded-full ${stockInfo.dotColor} animate-pulse`} />
                <div className={`absolute inset-0 ${dotSize} rounded-full ${stockInfo.dotColor} animate-ping opacity-75`} />
            </div>
            {showCount && (
                <span className={`text-step--1 ${stockInfo.textColor} tracking-wide font-medium`}>
                    {stockInfo.count} in stock
                </span>
            )}
        </div>
    );
}
