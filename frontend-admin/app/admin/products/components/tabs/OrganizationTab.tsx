/**
 * Organization Tab (REFACTORED - Domain Store Version)
 * Uses useOrganizationStore
 */

'use client';

import FormSection from '../FormSection';
import { useOrganizationStore } from '@/domains/product/organization/organization.store';
import type { ProductStatus } from '@/domains/product/core/product.types';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

export default function OrganizationTab() {
    const { status, isFeatured, collections, setStatus, setFeatured, addCollection, removeCollection } =
        useOrganizationStore();

    // Trigger autosave
    useEffect(() => {
        const isEditMode = typeof window !== 'undefined' && window.location.pathname.includes('/edit');
        const productId = isEditMode ? 'editing' : undefined;
        triggerAutosave('current-user-id', productId);
    }, [status, isFeatured, collections]);

    const handleCollectionToggle = (collection: string, checked: boolean) => {
        if (checked) {
            addCollection(collection);
        } else {
            removeCollection(collection);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Product Status">
                <div className="space-y-4 sm:space-y-5">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e: any) => setStatus(e.target.value as ProductStatus)}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors cursor-pointer text-sm sm:text-base"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="ACTIVE">Active</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1.5">
                            {status === 'DRAFT' && 'Not visible to customers'}
                            {status === 'ACTIVE' && 'Visible in your online store'}
                            {status === 'ARCHIVED' && 'Hidden from store but not deleted'}
                        </p>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={isFeatured}
                            onChange={(e: any) => setFeatured(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="isFeatured" className="text-sm sm:text-base text-gray-900">
                            Feature this product on homepage
                        </label>
                    </div>
                </div>
            </FormSection>

            <FormSection title="Collections">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Add to Collections
                    </label>
                    <div className="space-y-2">
                        {['New Arrival', 'Best Seller', 'Summer Collection', 'Sale'].map((collection) => (
                            <div key={collection} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id={`collection-${collection}`}
                                    checked={collections.includes(collection)}
                                    onChange={(e: any) => handleCollectionToggle(collection, e.target.checked)}
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-black border-gray-300 rounded focus:ring-black"
                                />
                                <label
                                    htmlFor={`collection-${collection}`}
                                    className="text-sm sm:text-base text-gray-900"
                                >
                                    {collection}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
