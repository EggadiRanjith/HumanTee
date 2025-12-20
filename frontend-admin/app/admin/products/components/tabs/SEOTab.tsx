/**
 * SEO Tab (REFACTORED - Domain Store Version)
 * Uses useSEOStore + slug generator
 */

'use client';

import FormSection from '../FormSection';
import CharacterCounter from '../CharacterCounter';
import TagInput from '../TagInput';
import { useSEOStore } from '@/domains/product/seo/seo.store';
import { useBasicInfoStore } from '@/domains/product/basic-info/basic-info.store';
import { selectMetaTitlePreview, selectMetaDescriptionPreview } from '@/domains/product/core/product.selectors';
import { useEffect } from 'react';
import { triggerAutosave } from '@/domains/product/autosave/autosave.service';

// Slug generator
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export default function SEOTab() {
    const { slug, metaTitle, metaDescription, tags, setSlug, setMetaTitle, setMetaDescription, setTags } =
        useSEOStore();
    const { name, description } = useBasicInfoStore();

    // Auto-generate slug from product name
    useEffect(() => {
        if (name && !slug) {
            setSlug(generateSlug(name));
        }
    }, [name, slug, setSlug]);

    // Trigger autosave
    useEffect(() => {
        triggerAutosave('current-user-id');
    }, [slug, metaTitle, metaDescription, tags]);

    const metaTitlePreview = selectMetaTitlePreview(metaTitle, name);
    const metaDescPreview = selectMetaDescriptionPreview(metaDescription, description);

    return (
        <div className="space-y-4 sm:space-y-6">
            <FormSection title="Search Engine Optimization">
                <div className="space-y-4 sm:space-y-5">
                    {/* URL Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            URL Slug *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                                placeholder="product-url-slug"
                                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => name && setSlug(generateSlug(name))}
                                disabled={!name}
                                className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
                            >
                                Generate
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                            yourstore.com/product/{slug || 'product-url'}
                        </p>
                    </div>

                    {/* Meta Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            value={metaTitle || ''}
                            onChange={(e) => setMetaTitle(e.target.value || undefined)}
                            placeholder={name || 'Product title for search results'}
                            maxLength={60}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors text-sm sm:text-base"
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
                            <CharacterCounter current={metaTitle?.length || 0} max={60} />
                        </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Meta Description
                        </label>
                        <textarea
                            value={metaDescription || ''}
                            onChange={(e) => setMetaDescription(e.target.value || undefined)}
                            placeholder="Brief description for search results..."
                            maxLength={160}
                            rows={3}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black outline-none resize-none transition-colors text-sm sm:text-base"
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                            <CharacterCounter current={metaDescription?.length || 0} max={160} />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Product Tags
                        </label>
                        <TagInput
                            tags={tags}
                            onChange={setTags}
                            placeholder="Add tags for search and filtering..."
                            maxTags={20}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">
                            Tags help customers find your product
                        </p>
                    </div>
                </div>
            </FormSection>

            {/* Search Preview */}
            <FormSection title="Search Preview">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-1">
                        <div className="text-blue-600 text-sm">
                            yourstore.com/product/{slug || 'product-url'}
                        </div>
                        <div className="text-purple-700 text-lg font-medium">{metaTitlePreview}</div>
                        <div className="text-gray-600 text-sm">{metaDescPreview}</div>
                    </div>
                </div>
            </FormSection>
        </div>
    );
}
