'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export type VideoSlide = {
    type: 'video';
    video: string; // Cloudinary URL or base64 data URL
};
export type ImageSlide = {
    type: 'image';
    image: string;
    mobileImage?: string;
    heading: string;
    subheading1: string;
    subheading2: string;
    buttonText: string;
    buttonUrl: string;
};
export type HeroSlide = VideoSlide | ImageSlide;

interface Props {
    slides: HeroSlide[];
    onChange: (slides: HeroSlide[]) => void;
    isEditing: boolean;
}

export function HeroSlidesManager({ slides, onChange, isEditing }: Props) {
    const { upload, uploading } = useCloudinaryUpload();
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const handleVideoSelect = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = async function () {
            window.URL.revokeObjectURL(video.src);
            const duration = video.duration;

            if (duration < 4 || duration > 7) {
                toast.error(`Video must be 4-7 seconds. Yours is ${duration.toFixed(1)}s.`);
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                const newSlides = [...slides];
                if (index !== -1 && newSlides[index]) {
                    (newSlides[index] as VideoSlide).video = base64;
                } else {
                    newSlides.unshift({
                        type: 'video',
                        video: base64,
                    });
                }
                onChange(newSlides);
                toast.success('Video selected. Remember to click Save to upload.');
            };
            reader.readAsDataURL(file);
        };

        video.src = URL.createObjectURL(file);
    };

    const handleImageSelect = (slideIndex: number, field: 'image' | 'mobileImage', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const newSlides = [...slides];
            (newSlides[slideIndex] as ImageSlide)[field] = base64;
            onChange(newSlides);
            toast.success('Image selected. Remember to click Save to upload.');
        };
        reader.readAsDataURL(file);
    };

    const updateSlide = (index: number, field: string, value: string) => {
        const newSlides = [...slides];
        (newSlides[index] as any)[field] = value;
        onChange(newSlides);
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
        onChange([...slides, newSlide]);
    };

    const removeSlide = (index: number) => {
        onChange(slides.filter((_, i) => i !== index));
    };

    const videoSlideIndex = slides.findIndex(s => s.type === 'video');
    const videoSlide = videoSlideIndex !== -1 ? slides[videoSlideIndex] as VideoSlide : null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
                <p className="text-sm text-gray-600 mt-1">Main hero carousel</p>
            </div>

            <div className="space-y-8">
                {/* Video Slide - Always shown as holder */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-800">Featured Video Slide</h3>
                        {isEditing && videoSlide && (
                            <button
                                onClick={() => removeSlide(videoSlideIndex)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                            >
                                <FiTrash2 size={16} />
                                Remove Video
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video File (4-7 seconds)
                            </label>
                            {isEditing ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleVideoSelect(videoSlideIndex, e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 break-all">
                                        {videoSlide?.video && !videoSlide.video.startsWith('data:')
                                            ? `Current: ${videoSlide.video}`
                                            : videoSlide?.video
                                                ? 'Video selected (not uploaded)'
                                                : 'No video uploaded yet'}
                                    </p>
                                    {videoSlide?.video.startsWith('data:') && (
                                        <div className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block">
                                            Not uploaded yet. Click Save to upload.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600 break-all">
                                        {videoSlide?.video?.startsWith('data:')
                                            ? 'Video selected (pending save)'
                                            : videoSlide?.video || 'No video'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Image Slides */}
                {slides.map((slide, index) => {
                    if (slide.type !== 'image') return null;
                    const imageSlide = slide as ImageSlide;

                    return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-800">Slide {index + 1}</h3>
                                {isEditing && (
                                    <button
                                        onClick={() => removeSlide(index)}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <FiTrash2 size={16} />
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Image</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e: any) => handleImageSelect(index, 'image', e)}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                    disabled={uploading}
                                                />
                                                {imageSlide.image.startsWith('data:') && (
                                                    <div className="mt-1 text-[10px] font-semibold text-amber-600">Pending upload</div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-600 break-all">{imageSlide.image || 'No image'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Image</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e: any) => handleImageSelect(index, 'mobileImage', e)}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                    disabled={uploading}
                                                />
                                                {imageSlide.mobileImage?.startsWith('data:') && (
                                                    <div className="mt-1 text-[10px] font-semibold text-amber-600">Pending upload</div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-600 break-all">{imageSlide.mobileImage || 'No image'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Heading"
                                        value={imageSlide.heading}
                                        onChange={(e: any) => updateSlide(index, 'heading', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subheading 1"
                                        value={imageSlide.subheading1}
                                        onChange={(e: any) => updateSlide(index, 'subheading1', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subheading 2 (optional)"
                                        value={imageSlide.subheading2}
                                        onChange={(e: any) => updateSlide(index, 'subheading2', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Button Text"
                                        value={imageSlide.buttonText}
                                        onChange={(e: any) => updateSlide(index, 'buttonText', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Button URL"
                                        value={imageSlide.buttonUrl}
                                        onChange={(e: any) => updateSlide(index, 'buttonUrl', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

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
    );
}
