'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

type VideoSlide = { type: 'video'; video: string };
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

interface Props {
    slides: HeroSlide[];
    onChange: (slides: HeroSlide[]) => void;
    isEditing: boolean;
}

export function HeroSlidesManager({ slides, onChange, isEditing }: Props) {
    const { upload, uploading } = useCloudinaryUpload();
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            setUploadingVideo(true);
            try {
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

                if (!response.ok) throw new Error('Upload failed');

                const data = await response.json();
                const url = data.url;

                const videoSlideIndex = slides.findIndex(s => s.type === 'video');
                if (videoSlideIndex !== -1) {
                    const newSlides = [...slides];
                    (newSlides[videoSlideIndex] as VideoSlide).video = url;
                    onChange(newSlides);
                    toast.success('Video uploaded! Remember to save changes.');
                }
            } catch (error: any) {
                toast.error(`Failed to upload: ${error.message}`);
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
            if (!url) return;
            const newSlides = [...slides];
            (newSlides[slideIndex] as ImageSlide)[field] = url;
            onChange(newSlides);
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    const updateImageSlide = (index: number, field: keyof ImageSlide, value: string) => {
        const newSlides = [...slides];
        (newSlides[index] as ImageSlide)[field] = value as any;
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

    const removeImageSlide = (index: number) => {
        onChange(slides.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
                <p className="text-sm text-gray-600 mt-1">Main hero carousel</p>
            </div>

            <div className="space-y-8">
                {/* Video Slide */}
                {slides.find(s => s.type === 'video') && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Slide 1 - Video</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video File (4-7 seconds)
                            </label>
                            {isEditing ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                        disabled={uploading || uploadingVideo}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Current: {(slides.find(s => s.type === 'video') as VideoSlide)?.video || 'No video'}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    {(slides.find(s => s.type === 'video') as VideoSlide)?.video || 'No video'}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Image Slides */}
                {slides.map((slide, index) => {
                    if (slide.type !== 'image') return null;
                    const imageSlide = slide as ImageSlide;

                    return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-800">Slide {index + 1}</h3>
                                {isEditing && slides.filter(s => s.type === 'image').length > 1 && (
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Image</label>
                                        {isEditing ? (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e: any) => handleImageUpload(index, 'image', e)}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                disabled={uploading}
                                            />
                                        ) : (
                                            <p className="text-xs text-gray-600 break-all">{imageSlide.image || 'No image'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Image</label>
                                        {isEditing ? (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e: any) => handleImageUpload(index, 'mobileImage', e)}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                disabled={uploading}
                                            />
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
                                        onChange={(e: any) => updateImageSlide(index, 'heading', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subheading 1"
                                        value={imageSlide.subheading1}
                                        onChange={(e: any) => updateImageSlide(index, 'subheading1', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subheading 2 (optional)"
                                        value={imageSlide.subheading2}
                                        onChange={(e: any) => updateImageSlide(index, 'subheading2', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Button Text"
                                        value={imageSlide.buttonText}
                                        onChange={(e: any) => updateImageSlide(index, 'buttonText', e.target.value)}
                                        readOnly={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm read-only:bg-gray-50 read-only:text-gray-600"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Button URL"
                                        value={imageSlide.buttonUrl}
                                        onChange={(e: any) => updateImageSlide(index, 'buttonUrl', e.target.value)}
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
