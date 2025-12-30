/**
 * Basic Info Tab (REFACTORED - Domain Store Version)
 * Uses useBasicInfoStore instead of monolithic form state
 */

'use client';

import FormSection from '../FormSection';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

interface BasicInfoTabProps {
    errors?: {
        name?: string;
        description?: string;
        productType?: string;
        category?: string;
    };
}

export default function BasicInfoTab({ errors }: BasicInfoTabProps) {
    const { name, description, productType, category, setName, setDescription, setProductType, setCategory } =
        useBasicInfoStore();

    // Trigger autosave on changes
    useEffect(() => {
        triggerAutosave('current-user-id');
    }, [name, description, productType, category]);

    return (
        <div className="space-y-6 sm:space-y-8">
            <FormSection title="Basic Information">
                <div className="space-y-4 sm:space-y-5">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e: any) => setName(e.target.value)}
                            placeholder="e.g., Classic White T-Shirt"
                            className={`w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 ${errors?.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors?.name && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e: any) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Describe your product..."
                            className={`w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 resize-none ${errors?.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors?.description && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Product Type & Category - Stack on mobile, row on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                            <label htmlFor="productType" className="block text-sm font-medium text-gray-900 mb-2">
                                Product Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="productType"
                                value={productType}
                                onChange={(e: any) => setProductType(e.target.value)}
                                className={`w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 ${errors?.productType ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select type</option>
                                <option value="t-shirt">T-Shirt</option>
                                <option value="hoodie">Hoodie</option>
                                <option value="sweatshirt">Sweatshirt</option>
                                <option value="accessories">Accessories</option>
                            </select>
                            {errors?.productType && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.productType}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e: any) => setCategory(e.target.value)}
                                className={`w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 ${errors?.category ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select category</option>
                                <option value="drop1">Drop 1</option>
                                <option value="drop2">Drop 2</option>
                                <option value="drop3">Drop 3</option>
                            </select>
                            {errors?.category && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.category}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
