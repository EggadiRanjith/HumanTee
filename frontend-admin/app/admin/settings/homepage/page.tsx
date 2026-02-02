/**
 * Homepage Settings - Refactored
 * Orchestrates hero slides, banner messages, and reviews components
 */

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { useHomepageSettings, useUpdateHomepageSettings } from '@/lib/queries/useHomepageSettings';
import { HeroSlidesManager, type HeroSlide, type VideoSlide, type ImageSlide } from './components/HeroSlidesManager';
import { BannerMessagesManager } from './components/BannerMessagesManager';
import { ReviewsManager } from './components/ReviewsManager';
import SettingsBackButton from '../_components/SettingsBackButton';
import { UploadProgressModal, type UploadItem } from '@/app/components/UploadProgressModal';
import apiClient from '@/lib/api-client';

export default function HomepageSettings() {
    const [isEditing, setIsEditing] = useState(false);
    const { data, isLoading } = useHomepageSettings();
    const updateMutation = useUpdateHomepageSettings();

    // Upload states
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);

    // Local state for editing
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [bannerMessages, setBannerMessages] = useState<string[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsEnabled, setReviewsEnabled] = useState(true);

    // Update local state when data loads
    useEffect(() => {
        if (data) {
            setHeroSlides(data.hero_slides?.slides || []);
            setBannerMessages(data.banner_messages?.messages || []);
            setReviews(data.reviews?.reviews || []);
            setReviewsEnabled(data.reviews_settings?.enabled ?? true);
        }
    }, [data]);

    const handleSave = async () => {
        // 1. Identify media that needs uploading
        const uploads: Array<{ id: string, file: Blob, isVideo: boolean, slideIndex: number, field?: 'image' | 'mobileImage' }> = [];

        for (let i = 0; i < heroSlides.length; i++) {
            const slide = heroSlides[i];
            if (slide.type === 'video' && slide.video.startsWith('data:')) {
                const blob = await fetch(slide.video).then(r => r.blob());
                uploads.push({ id: `video-${i}`, file: blob, isVideo: true, slideIndex: i });
            } else if (slide.type === 'image') {
                if (slide.image.startsWith('data:')) {
                    const blob = await fetch(slide.image).then(r => r.blob());
                    uploads.push({ id: `image-${i}`, file: blob, isVideo: false, slideIndex: i, field: 'image' });
                }
                if (slide.mobileImage?.startsWith('data:')) {
                    const blob = await fetch(slide.mobileImage).then(r => r.blob());
                    uploads.push({ id: `mobile-${i}`, file: blob, isVideo: false, slideIndex: i, field: 'mobileImage' });
                }
            }
        }

        // 2. Perform uploads if needed
        let finalSlides = [...heroSlides];
        if (uploads.length > 0) {
            setUploadItems(uploads.map(u => ({
                id: u.id,
                fileName: u.isVideo ? `Video Slide` : `Image Slide ${u.slideIndex + 1} (${u.field})`,
                progress: 0,
                status: 'pending'
            })));
            setUploadModalOpen(true);

            for (const uploadItem of uploads) {
                setUploadItems(prev => prev.map(item =>
                    item.id === uploadItem.id ? { ...item, status: 'uploading' } : item
                ));

                try {
                    const formData = new FormData();
                    formData.append('file', uploadItem.file);

                    const endpoint = uploadItem.isVideo ? '/upload/video' : '/upload/image';
                    const response = await apiClient.post(endpoint, formData, {
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / (progressEvent.total || 1)
                            );
                            setUploadItems(prev => prev.map(item =>
                                item.id === uploadItem.id ? { ...item, progress: percentCompleted } : item
                            ));
                        }
                    });

                    const url = response.data.url;
                    if (uploadItem.isVideo) {
                        (finalSlides[uploadItem.slideIndex] as VideoSlide).video = url;
                    } else {
                        (finalSlides[uploadItem.slideIndex] as ImageSlide)[uploadItem.field!] = url;
                    }

                    setUploadItems(prev => prev.map(item =>
                        item.id === uploadItem.id ? { ...item, status: 'success', progress: 100 } : item
                    ));
                } catch (error: any) {
                    setUploadItems(prev => prev.map(item =>
                        item.id === uploadItem.id ? { ...item, status: 'error', error: error.message || 'Upload failed' } : item
                    ));
                    toast.error(`Upload failed for ${uploadItem.id}`);
                    // Give user time to see error
                    setTimeout(() => setUploadModalOpen(false), 3000);
                    return;
                }
            }

            // Sync with local state
            setHeroSlides(finalSlides);
            // Brief pause to show 100% completion
            await new Promise(r => setTimeout(r, 800));
            setUploadModalOpen(false);
        }

        // 3. Final validation: Prevent base64 from entering DB
        const hasBase64 = finalSlides.some(slide => {
            if (slide.type === 'video') return slide.video.startsWith('data:');
            return slide.image.startsWith('data:') || slide.mobileImage?.startsWith('data:');
        });

        if (hasBase64) {
            toast.error('Some media files failed to upload. Please try again.');
            return;
        }

        // 4. Save settings
        const payload = {
            hero_slides: { slides: finalSlides },
            banner_messages: { messages: bannerMessages },
            reviews: { reviews },
            reviews_settings: { enabled: reviewsEnabled }
        };

        try {
            await updateMutation.mutateAsync(payload);
            toast.success('Homepage settings saved successfully!');
            setIsEditing(false);
        } catch (error: any) {
            if (error.response?.status === 403) {
                toast.error('Permission denied! Contact admin.');
            } else {
                toast.error(`Failed to save: ${error.message}`);
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original data
        if (data) {
            setHeroSlides(data.hero_slides?.slides || []);
            setBannerMessages(data.banner_messages?.messages || []);
            setReviews(data.reviews?.reviews || []);
            setReviewsEnabled(data.reviews_settings?.enabled ?? true);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading homepage settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-4 lg:p-6 xl:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <SettingsBackButton />

                {/* Header - Compact Mobile */}
                <div className="mb-4 md:mb-6 lg:mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">Homepage Content</h1>
                        <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                            Manage all homepage sections
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-2 md:px-3 lg:px-4 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-2 md:px-3 lg:px-4 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                                className="px-2 md:px-3 lg:px-4 xl:px-6 py-1 md:py-1.5 lg:py-2 xl:py-2.5 text-xs md:text-sm lg:text-base bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-colors font-medium shadow-sm"
                            >
                                {updateMutation.isPending ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Content Sections - Compact Mobile */}
                <div className="space-y-4 md:space-y-6">
                    <HeroSlidesManager
                        slides={heroSlides}
                        onChange={setHeroSlides}
                        isEditing={isEditing}
                    />

                    <BannerMessagesManager
                        messages={bannerMessages}
                        onChange={setBannerMessages}
                        isEditing={isEditing}
                    />

                    <ReviewsManager
                        reviews={reviews}
                        enabled={reviewsEnabled}
                        onChange={setReviews}
                        onEnabledChange={setReviewsEnabled}
                        isEditing={isEditing}
                    />
                </div>
            </div>

            {/* Upload Progress Modal */}
            <UploadProgressModal
                isOpen={uploadModalOpen}
                items={uploadItems}
                onComplete={() => setUploadModalOpen(false)}
            />
        </div>
    );
}
