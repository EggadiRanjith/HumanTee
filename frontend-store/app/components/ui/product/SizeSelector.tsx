/**
 * Size Selector
 * Grid of size buttons with selection state
 */

"use client";

interface SizeSelectorProps {
    sizes: string[];
    selected: string;
    onChange: (size: string) => void;
    error?: boolean;
}

export function SizeSelector({ sizes, selected, onChange, error }: SizeSelectorProps) {
    return (
        <div className="space-y-3">
            <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                Select Size
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => onChange(size)}
                        className={`
              py-2.5 rounded-lg 
              border transition-all
              text-[0.75rem] uppercase tracking-[0.15em]
              ${selected === size
                                ? 'bg-white text-black border-white'
                                : 'border-white/10 luxury-glass text-white/75 hover:border-white/30'
                            }
            `}
                    >
                        {size}
                    </button>
                ))}
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
