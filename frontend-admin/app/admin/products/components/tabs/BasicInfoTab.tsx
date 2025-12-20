/**
 * Basic Info Tab (REFACTORED - Domain Store Version)
 * Uses useBasicInfoStore instead of monolithic form state
 */

'use client';

import FormSection from '../FormSection';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

export default function BasicInfoTab() {
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
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Classic White T-Shirt"
                            className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Describe your product..."
                            className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 resize-none"
                        />
                    </div>

                    {/* Product Type & Category - Stack on mobile, row on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                            <label htmlFor="productType" className="block text-sm font-medium text-gray-900 mb-2">
                                Product Type
                            </label>
                            <select
                                id="productType"
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="">Select type</option>
                                <option value="t-shirt">T-Shirt</option>
                                <option value="hoodie">Hoodie</option>
                                <option value="sweatshirt">Sweatshirt</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-3 sm:px-4 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="">Select category</option>
                                <option value="drop1">Drop 1</option>
                                <option value="drop2">Drop 2</option>
                                <option value="drop3">Drop 3</option>
                            </select>
                        </div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
