'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

type Review = {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    text: string;
};

interface Props {
    reviews: Review[];
    enabled: boolean;
    onChange: (reviews: Review[]) => void;
    onEnabledChange: (enabled: boolean) => void;
    isEditing: boolean;
}

export function ReviewsManager({ reviews, enabled, onChange, onEnabledChange, isEditing }: Props) {
    const { upload, uploading } = useCloudinaryUpload();

    const handleAvatarUpload = async (reviewIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await upload(file);
            if (!url) return;
            const newReviews = [...reviews];
            newReviews[reviewIndex].avatar = url;
            onChange(newReviews);
        } catch (error) {
            toast.error('Failed to upload avatar');
        }
    };

    const updateReview = (index: number, field: keyof Review, value: any) => {
        const newReviews = [...reviews];
        newReviews[index][field] = value;
        onChange(newReviews);
    };

    const addReview = () => {
        const newReview: Review = {
            id: reviews.length + 1,
            name: '',
            role: '',
            avatar: '',
            rating: 5,
            text: ''
        };
        onChange([...reviews, newReview]);
    };

    const removeReview = (index: number) => {
        onChange(reviews.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                <p className="text-sm text-gray-600 mt-1">Manage testimonials</p>
            </div>

            <div className="space-y-6">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Show Reviews Section</p>
                        <p className="text-xs text-gray-500 mt-1">Display on homepage</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e: any) => onEnabledChange(e.target.checked)}
                            disabled={!isEditing}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                </div>

                {/* Reviews List */}
                {reviews.map((review, index: number) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-800">Review {index + 1}</h3>
                            {isEditing && reviews.length > 1 && (
                                <button
                                    onClick={() => removeReview(index)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <FiTrash2 size={16} />
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Avatar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Avatar Image
                                </label>
                                {isEditing ? (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e: any) => handleAvatarUpload(index, e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                        disabled={uploading}
                                    />
                                ) : (
                                    <p className="text-xs text-gray-600 break-all">{review.avatar || 'No avatar'}</p>
                                )}
                            </div>

                            {/* Name & Role */}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={review.name}
                                    onChange={(e: any) => updateReview(index, 'name', e.target.value)}
                                    readOnly={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                />
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={review.role}
                                    onChange={(e: any) => updateReview(index, 'role', e.target.value)}
                                    readOnly={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <select
                                    value={review.rating}
                                    onChange={(e: any) => updateReview(index, 'rating', Number(e.target.value))}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm disabled:bg-gray-50 disabled:text-gray-600"
                                >
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Review Text */}
                            <textarea
                                placeholder="Review text"
                                value={review.text}
                                onChange={(e: any) => updateReview(index, 'text', e.target.value)}
                                readOnly={!isEditing}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                            />
                        </div>
                    </div>
                ))}

                {/* Add Review Button */}
                {isEditing && (
                    <button
                        onClick={addReview}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span className="text-sm font-medium">Add Review</span>
                    </button>
                )}
            </div>
        </div>
    );
}
