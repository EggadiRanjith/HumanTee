/**
 * Slug Input Component
 * URL slug input with auto-generation and validation
 */

'use client';

import { useEffect, useState } from 'react';
import { generateSlug, validateSlug } from '@/utils/product-form.utils';

interface SlugInputProps {
    value: string;
    productName: string;
    onChange: (slug: string) => void;
    error?: string;
}

export default function SlugInput({
    value,
    productName,
    onChange,
    error,
}: SlugInputProps) {
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if (value) {
            setIsValid(validateSlug(value));
        }
    }, [value]);

    const handleGenerate = () => {
        const slug = generateSlug(productName);
        onChange(slug);
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e: any) => onChange(e.target.value.toLowerCase())}
                    placeholder="product-url-slug"
                    className={`
            flex-1 px-4 py-3 bg-white border-2 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black outline-none transition-colors
            ${error || !isValid
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-400 focus:border-black'
                        }
          `}
                />
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!productName}
                    className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-3 rounded-lg font-medium transition-colors text-sm whitespace-nowrap disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Generate
                </button>
            </div>

            {/* Preview URL */}
            {value && isValid && (
                <p className="text-xs text-gray-600">
                    URL: <span className="text-black font-mono">yourstore.com/product/{value}</span>
                </p>
            )}

            {/* Validation Error */}
            {!isValid && value && (
                <p className="text-xs text-red-600">
                    Only lowercase letters, numbers, and hyphens allowed
                </p>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
