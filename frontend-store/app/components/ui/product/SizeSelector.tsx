/**
 * Size Selector
 * Grid of size buttons with selection state and stock indicators
 */

"use client";

interface SizeSelectorProps {
    sizes: string[];
    selected: string;
    onChange: (size: string) => void;
    error?: boolean;
    variants?: any[]; // Variant data with stock info
}

export function SizeSelector({ sizes, selected, onChange, error, variants = [] }: SizeSelectorProps) {
    // Helper to get stock for a size
    const getStockForSize = (size: string) => {
        const variant = variants.find((v: any) => v.size === size);
        return variant?.stock ?? variant?.stockQuantity ?? 0;
    };

    return (
        <div className="space-y-3">
            <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                Select Size
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sizes.map((size) => {
                    const stock = getStockForSize(size);
                    const isLowStock = stock > 0 && stock < 10;
                    const isOutOfStock = stock === 0;

                    return (
                        <div key={size} className="flex flex-col gap-1">
                            <button
                                onClick={() => onChange(size)}
                                disabled={isOutOfStock}
                                aria-label={`Select size ${size}`}
                                className={`
                                    py-3.5 rounded-lg 
                                    border transition-all
                                    text-[0.75rem] uppercase tracking-[0.15em]
                                    ${selected === size
                                        ? 'bg-white text-black border-white'
                                        : isOutOfStock
                                            ? 'border-white/5 luxury-glass text-white/20 cursor-not-allowed'
                                            : 'border-white/10 luxury-glass text-white/75 hover:border-white/30'
                                    }
                                `}
                            >
                                {size}
                            </button>
                            {/* Stock indicator below size - only show if stock < 10 */}
                            {isLowStock && (
                                <div className="flex items-center justify-center gap-1 animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
                                    <span className="text-[9px] text-orange-400 font-medium">
                                        {stock} left
                                    </span>
                                </div>
                            )}
                            {isOutOfStock && (
                                <span className="text-[9px] text-red-400 text-center">
                                    Out
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="p-4 rounded-lg luxury-glass border border-red-400/50 bg-red-500/15">
                    <p className="text-red-200 text-[11px] uppercase tracking-[0.2em] text-center font-light">
                        Please select a size
                    </p>
                </div>
            )}
        </div>
    );
}
