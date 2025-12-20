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
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Basic Information">
                <div className="space-y-4 sm:space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Premium Cotton T-Shirt"
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your product..."
                            rows={5}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black outline-none resize-none transition-colors text-sm sm:text-base"
                        />
                    </div>

                    {/* Product Type & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Product Type
                            </label>
                            <select
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors cursor-pointer text-sm sm:text-base"
                            >
                                <option value="T-Shirt">T-Shirt</option>
                                <option value="Shirt">Shirt</option>
                                <option value="Polo">Polo</option>
                                <option value="Hoodie">Hoodie</option>
                                <option value="Sweatshirt">Sweatshirt</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors cursor-pointer text-sm sm:text-base"
                            >
                                <option value="Drop 1">Drop 1</option>
                                <option value="Drop 2">Drop 2</option>
                                <option value="Drop 3">Drop 3</option>
                                <option value="Drop 4">Drop 4</option>
                                <option value="Drop 5">Drop 5</option>
                            </select>
                        </div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
