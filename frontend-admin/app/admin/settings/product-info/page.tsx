/**
 * Product Information Settings
 * Edit product page details: material, shipping, size info
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUpload, FiX, FiPlus, FiSave } from 'react-icons/fi';
import { useAdminSettings } from '@/lib/queries/useSettings';
import { settingsApi } from '@/lib/api/settings';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export default function ProductInfoSettings() {
    const [formData, setFormData] = useState({
        material_care: [] as string[],
        shipping_returns: [] as string[],
        size_fit: [] as string[],
        size_guide_images: [] as string[]
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { upload, uploading, error: uploadError } = useCloudinaryUpload();

    // Use React Query hook - automatic caching and loading states
    const { data, isLoading } = useAdminSettings('product-info');

    // Update local state when data loads
    useEffect(() => {
        if (data) {
            setFormData({
                material_care: data.material_care || [],
                shipping_returns: data.shipping_returns || [],
                size_fit: data.size_fit || [],
                size_guide_images: data.size_guide_images || []
            });
        }
    }, [data]);

    // Handle Image Upload (up to 5)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check if we already have 5 images
        if (formData.size_guide_images.length >= 5) {
            alert('Maximum 5 images allowed for size guide');
            return;
        }

        const remainingSlots = 5 - formData.size_guide_images.length;
        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        for (const file of filesToUpload) {
            const url = await upload(file, {
                maxSize: 5 * 1024 * 1024, // 5MB
                allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
            });

            if (url) {
                setFormData(prev => ({
                    ...prev,
                    size_guide_images: [...prev.size_guide_images, url]
                }));
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            size_guide_images: prev.size_guide_images.filter((_, i) => i !== index)
        }));
    };

    // Handle List Updates
    const handleListUpdate = (key: 'material_care' | 'shipping_returns' | 'size_fit', value: string) => {
        const lines = value.split('\n').filter(line => line.trim() !== '');
        setFormData(prev => ({ ...prev, [key]: lines }));
    };

    // Save changes
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsApi.saveSection('product-info', formData);
            setIsEditing(false);
            alert('Product information updated successfully!');
        } catch (error) {
            // Save failed
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600 animate-pulse">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/admin/settings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </Link>

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Information</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage product page details and size guide images
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-colors font-medium shadow-sm"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiSave size={18} />
                                )}
                                {isSaving ? 'Saving...' : 'Save All'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Material & Care */}
                    <SectionCard
                        title="Material & Care"
                        description="Instructions displayed in the product details"
                        value={formData.material_care.join('\n')}
                        onChange={(val: string) => handleListUpdate('material_care', val)}
                        isEditing={isEditing}
                        placeholder="100% Premium Cotton&#10;Machine wash cold..."
                    />

                    {/* Shipping & Returns */}
                    <SectionCard
                        title="Shipping & Returns"
                        description="Delivery and return info for customers"
                        value={formData.shipping_returns.join('\n')}
                        onChange={(val: string) => handleListUpdate('shipping_returns', val)}
                        isEditing={isEditing}
                        placeholder="Standard delivery: 3-5 days&#10;30-day return policy..."
                    />

                    {/* Size & Fit */}
                    <SectionCard
                        title="Size & Fit"
                        description="Sizing details and model information"
                        value={formData.size_fit.join('\n')}
                        onChange={(val: string) => handleListUpdate('size_fit', val)}
                        isEditing={isEditing}
                        placeholder="Unisex relaxed fit&#10;Model is 6' wearing size M..."
                    />

                    {/* Size Guide Multi-Images */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
                        <div className="border-b border-gray-100 pb-4 mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Size Guide Images</h2>
                                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    {formData.size_guide_images.length}/5 Images
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Upload charts, measuring guides, or fit diagrams (up to 5)</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {formData.size_guide_images.map((url, index) => (
                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                                    <img src={url} alt={`Size guide ${index + 1}`} className="w-full h-full object-cover" />
                                    {isEditing && (
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {isEditing && formData.size_guide_images.length < 5 && (
                                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-400 hover:bg-violet-50/50 transition-all">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                        id="size-guide-upload"
                                    />
                                    <label
                                        htmlFor="size-guide-upload"
                                        className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2 text-center"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            <FiPlus className="text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">
                                            {uploading ? '...' : 'Add Image'}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                        {uploadError && <p className="text-xs text-red-500 mt-3 font-medium bg-red-50 p-2 rounded">{uploadError}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionCard({ title, description, value, onChange, isEditing, placeholder }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>

            <div>
                <textarea
                    rows={5}
                    value={value}
                    onChange={(e: any) => onChange(e.target.value)}
                    placeholder={placeholder}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black resize-none font-mono text-sm leading-relaxed ${!isEditing ? 'bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed' : 'bg-white shadow-inner-sm animate-in fade-in duration-300'}`}
                />
                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                    Enter one point per line
                </p>
            </div>
        </div>
    );
}
