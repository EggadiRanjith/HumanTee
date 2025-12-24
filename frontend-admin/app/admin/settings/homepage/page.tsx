/**
 * Homepage Settings
 * Edit all homepage content: hero, banner, and reviews
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiTrash2, FiPlus, FiUpload } from 'react-icons/fi';
import { settingsApi } from '@/lib/api/settings';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

// Type definitions
type VideoSlide = {
    type: 'video';
    video: string;
};

type ImageSlide = {
    type: 'image';
    image: string;
    mobileImage?: string;
    heading: string;
    subheading1: string;
    subheading2: string;
    buttonText: string;
    buttonUrl: string;
};

type HeroSlide = VideoSlide | ImageSlide;

type Review = {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    text: string;
};

export default function HomepageSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Hero Slides State
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

    // Banner Messages State
    const [bannerMessages, setBannerMessages] = useState<string[]>([]);

    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsEnabled, setReviewsEnabled] = useState(true);

    // Upload states
    const { upload, uploading } = useCloudinaryUpload();
    const [uploadingVideo, setUploadingVideo] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        fetchHomepageSettings();
    }, []);

    const fetchHomepageSettings = async () => {
        try {
            setIsLoading(true);

            // Fetch all homepage settings
            const data = await settingsApi.getSection('homepage');

            // Parse hero slides (backend returns without 'homepage.' prefix)
            if (data?.hero_slides?.slides) {
                setHeroSlides(data.hero_slides.slides);
            }

            // Parse banner messages
            if (data?.banner_messages?.messages) {
                setBannerMessages(data.banner_messages.messages);
            }

            // Parse reviews
            if (data?.reviews?.reviews) {
                setReviews(data.reviews.reviews);
            }

            // Parse reviews settings
            if (data?.reviews_settings) {
                setReviewsEnabled(data.reviews_settings.enabled ?? true);
            }
        } catch (error) {
            console.error('Error fetching homepage settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            // Check if any uploads are in progress
            if (uploading || uploadingVideo) {
                alert('Please wait for all uploads to complete before saving.');
                setIsSaving(false);
                return;
            }

            const payload = {
                hero_slides: { slides: heroSlides },
                banner_messages: { messages: bannerMessages },
                reviews: { reviews },
                reviews_settings: { enabled: reviewsEnabled }
            };

            console.log('💾 Saving homepage settings:', payload);

            // Save all homepage settings (without 'homepage.' prefix in keys)
            await settingsApi.saveSection('homepage', payload);

            console.log('✅ Settings saved successfully to database');
            alert('Homepage settings saved successfully!');
            setIsEditing(false);

            // Refresh data to confirm save
            await fetchHomepageSettings();
        } catch (error: any) {
            console.error('❌ Error saving homepage settings:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);

            if (error.response?.status === 403) {
                alert('Permission denied! Your account does not have ADMIN privileges. Please contact an administrator to update your user role in the database.');
            } else {
                alert(`Failed to save settings: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Hero Slide Handlers
    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('📹 Starting video upload:', file.name);

        // Validate video duration (4-7 seconds)
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = async function () {
            window.URL.revokeObjectURL(video.src);
            const duration = video.duration;

            console.log('📹 Video duration:', duration, 'seconds');

            if (duration < 4 || duration > 7) {
                alert(`Video must be between 4-7 seconds long. Your video is ${duration.toFixed(1)} seconds.`);
                e.target.value = ''; // Clear the input
                return;
            }

            // Duration is valid, proceed with upload to video endpoint
            setUploadingVideo(true);
            try {
                console.log('📹 Uploading video to Cloudinary...');

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:3001/upload/video', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${document.cookie.match(/auth_token=([^;]+)/)?.[1]}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('❌ Video upload failed:', response.status, errorData);
                    throw new Error(`Video upload failed: ${errorData.message || response.statusText}`);
                }

                const data = await response.json();
                const url = data.url;

                console.log('✅ Video uploaded successfully:', url);

                if (!url) {
                    throw new Error('No URL returned from upload');
                }

                // Update the video slide with the new URL
                const videoSlideIndex = heroSlides.findIndex(slide => slide.type === 'video');
                if (videoSlideIndex !== -1) {
                    const newSlides = [...heroSlides];
                    (newSlides[videoSlideIndex] as VideoSlide).video = url;
                    setHeroSlides(newSlides);
                    console.log('✅ Video URL updated in state:', url);
                    alert('Video uploaded successfully! Remember to click "Save Changes" to persist it.');
                } else {
                    console.warn('⚠️ No video slide found in heroSlides');
                }
            } catch (error: any) {
                console.error('❌ Error uploading video:', error);
                alert(`Failed to upload video: ${error.message}`);
            } finally {
                setUploadingVideo(false);
            }
        };

        video.src = URL.createObjectURL(file);
    };

    const handleImageUpload = async (slideIndex: number, field: 'image' | 'mobileImage', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await upload(file);
            if (!url) return; // Upload failed
            const newSlides = [...heroSlides];
            (newSlides[slideIndex] as ImageSlide)[field] = url;
            setHeroSlides(newSlides);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        }
    };

    const updateImageSlide = (index: number, field: keyof ImageSlide, value: string) => {
        const newSlides = [...heroSlides];
        (newSlides[index] as ImageSlide)[field] = value as any;
        setHeroSlides(newSlides);
    };

    const addImageSlide = () => {
        const newSlide: ImageSlide = {
            type: 'image',
            image: '',
            mobileImage: '',
            heading: '',
            subheading1: '',
            subheading2: '',
            buttonText: 'Shop Now',
            buttonUrl: '/shop'
        };
        setHeroSlides([...heroSlides, newSlide]);
    };

    const removeImageSlide = (index: number) => {
        setHeroSlides(heroSlides.filter((_, i) => i !== index));
    };

    // Banner Message Handlers
    const updateBannerMessage = (index: number, value: string) => {
        const newMessages = [...bannerMessages];
        newMessages[index] = value;
        setBannerMessages(newMessages);
    };

    const addBannerMessage = () => {
        setBannerMessages([...bannerMessages, '']);
    };

    const removeBannerMessage = (index: number) => {
        setBannerMessages(bannerMessages.filter((_, i) => i !== index));
    };

    // Review Handlers
    const handleAvatarUpload = async (reviewIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await upload(file);
            if (!url) return; // Upload failed
            const newReviews = [...reviews];
            newReviews[reviewIndex].avatar = url;
            setReviews(newReviews);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        }
    };

    const updateReview = (index: number, field: keyof Review, value: any) => {
        const newReviews = [...reviews];
        newReviews[index][field] = value;
        setReviews(newReviews);
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
        setReviews([...reviews, newReview]);
    };

    const removeReview = (index: number) => {
        setReviews(reviews.filter((_, i) => i !== index));
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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/admin/settings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </Link>

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Homepage Content</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage all homepage sections and content
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchHomepageSettings(); // Reset to original data
                                }}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || uploading || uploadingVideo}
                                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-colors font-medium shadow-sm"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {isSaving ? 'Saving...' : (uploading || uploadingVideo) ? 'Uploading...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
                            <p className="text-sm text-gray-600 mt-1">Main hero carousel - first video, then image slides</p>
                        </div>

                        <div className="space-y-8">
                            {/* Video Slide */}
                            {heroSlides.find(s => s.type === 'video') && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Slide 1 - Video (Opening)</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Video File
                                        </label>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoUpload}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                    disabled={uploading}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Current: {(heroSlides.find(s => s.type === 'video') as VideoSlide)?.video || 'No video'}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-600">
                                                {(heroSlides.find(s => s.type === 'video') as VideoSlide)?.video || 'No video uploaded'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Image Slides */}
                            {heroSlides.map((slide, index) => {
                                if (slide.type !== 'image') return null;
                                const imageSlide = slide as ImageSlide;

                                return (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-gray-800">Slide {index + 1} - Image Banner</h3>
                                            {isEditing && heroSlides.filter(s => s.type === 'image').length > 1 && (
                                                <button
                                                    onClick={() => removeImageSlide(index)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <FiTrash2 size={16} />
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {/* Images */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Desktop Image
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(index, 'image', e)}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                            disabled={uploading}
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-gray-600 break-all">{imageSlide.image || 'No image'}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Mobile Image
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(index, 'mobileImage', e)}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                            disabled={uploading}
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-gray-600 break-all">{imageSlide.mobileImage || 'No image'}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div className="grid grid-cols-1 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Heading"
                                                    value={imageSlide.heading}
                                                    onChange={(e) => updateImageSlide(index, 'heading', e.target.value)}
                                                    readOnly={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Subheading 1"
                                                    value={imageSlide.subheading1}
                                                    onChange={(e) => updateImageSlide(index, 'subheading1', e.target.value)}
                                                    readOnly={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Subheading 2 (optional)"
                                                    value={imageSlide.subheading2}
                                                    onChange={(e) => updateImageSlide(index, 'subheading2', e.target.value)}
                                                    readOnly={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                />
                                            </div>

                                            {/* Button */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Button Text"
                                                    value={imageSlide.buttonText}
                                                    onChange={(e) => updateImageSlide(index, 'buttonText', e.target.value)}
                                                    readOnly={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Button URL"
                                                    value={imageSlide.buttonUrl}
                                                    onChange={(e) => updateImageSlide(index, 'buttonUrl', e.target.value)}
                                                    readOnly={!isEditing}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add Slide Button */}
                            {isEditing && (
                                <button
                                    onClick={addImageSlide}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiPlus className="w-5 h-5" />
                                    <span className="text-sm font-medium">Add Another Slide</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Homepage Banner Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Homepage Scrolling Banner</h2>
                            <p className="text-sm text-gray-600 mt-1">Messages that scroll between products and reviews</p>
                        </div>

                        <div className="space-y-3">
                            {bannerMessages.map((message, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => updateBannerMessage(index, e.target.value)}
                                        readOnly={!isEditing}
                                        placeholder="Banner message"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    {isEditing && bannerMessages.length > 1 && (
                                        <button
                                            onClick={() => removeBannerMessage(index)}
                                            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {isEditing && (
                                <button
                                    onClick={addBannerMessage}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Message</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                            <p className="text-sm text-gray-600 mt-1">Manage customer testimonials and reviews</p>
                        </div>

                        <div className="space-y-6">
                            {/* Section Settings */}
                            <div className="space-y-4">
                                {/* Display Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Show Reviews Section</p>
                                        <p className="text-xs text-gray-500 mt-1">Display customer reviews on homepage</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={reviewsEnabled}
                                            onChange={(e) => setReviewsEnabled(e.target.checked)}
                                            disabled={!isEditing}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Review Cards */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4">Review Cards</h3>
                                <div className="space-y-4">
                                    {reviews.map((review, index) => (
                                        <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-sm font-semibold text-gray-800">Review {index + 1}</h4>
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
                                            <div className="space-y-3">
                                                {/* Avatar Upload */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Avatar Image
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleAvatarUpload(index, e)}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                            disabled={uploading}
                                                        />
                                                    ) : (
                                                        <p className="text-xs text-gray-600 break-all">{review.avatar || 'No avatar'}</p>
                                                    )}
                                                </div>

                                                {/* Name & Role */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Customer Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Alexander Chen"
                                                            value={review.name}
                                                            onChange={(e) => updateReview(index, 'name', e.target.value)}
                                                            readOnly={!isEditing}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Role/Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Luxury Fashion Collector"
                                                            value={review.role}
                                                            onChange={(e) => updateReview(index, 'role', e.target.value)}
                                                            readOnly={!isEditing}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Rating
                                                    </label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => isEditing && updateReview(index, 'rating', star)}
                                                                disabled={!isEditing}
                                                                className={`text-2xl transition-colors ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                    } ${isEditing ? 'hover:text-yellow-500 cursor-pointer' : 'cursor-default'}`}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Review Text */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Review Text
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        placeholder="The craftsmanship and detail exceeded my expectations. Truly bespoke luxury."
                                                        value={review.text}
                                                        onChange={(e) => updateReview(index, 'text', e.target.value)}
                                                        readOnly={!isEditing}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                                    />
                                                </div>
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
                                            <span className="text-sm font-medium">Add Another Review</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

