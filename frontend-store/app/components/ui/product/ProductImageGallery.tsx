/**
 * Product Image Gallery
 * Image carousel with zoom, thumbnails, and swipe support
 */

"use client";

import Image from 'next/image';
import { useState, useEffect, memo } from 'react';
import { FiZoomIn, FiX } from 'react-icons/fi';

// Constants
const AUTO_ADVANCE_INTERVAL = 3000;
const SWIPE_THRESHOLD = 50;

interface ProductImageGalleryProps {
    images: string[];
    title: string;
    subtitle: string;
    productId: number;
}

const ProductImageGalleryComponent = ({ images, title, subtitle, productId }: ProductImageGalleryProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [zoomScale, setZoomScale] = useState(100);

    // Preload next image for smoother transitions
    useEffect(() => {
        if (images[currentImageIndex + 1]) {
            const img = new window.Image();
            img.src = images[currentImageIndex + 1];
        }
    }, [currentImageIndex, images]);

    // Auto-transition images
    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1 || isZoomed) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, AUTO_ADVANCE_INTERVAL);

        return () => clearInterval(interval);
    }, [isAutoPlaying, images.length, isZoomed]);

    // Handle browser back button to close zoom
    useEffect(() => {
        if (isZoomed && typeof window !== 'undefined') {
            window.history.pushState({ zoomOpen: true }, '');

            const handlePopState = () => setIsZoomed(false);
            window.addEventListener('popstate', handlePopState);

            return () => window.removeEventListener('popstate', handlePopState);
        }
    }, [isZoomed]);

    // Keyboard navigation for zoom modal
    useEffect(() => {
        if (!isZoomed) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    setIsZoomed(false);
                    break;
                case 'ArrowLeft':
                    if (currentImageIndex > 0) {
                        setCurrentImageIndex(currentImageIndex - 1);
                        setZoomScale(100);
                    }
                    break;
                case 'ArrowRight':
                    if (currentImageIndex < images.length - 1) {
                        setCurrentImageIndex(currentImageIndex + 1);
                        setZoomScale(100);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomed, currentImageIndex, images.length]);

    const handleImageSelect = (index: number) => {
        setCurrentImageIndex(index);
        setIsAutoPlaying(false);
    };

    const handleZoomOpen = () => {
        setIsAutoPlaying(false);
        setIsZoomed(true);
        setZoomScale(100);
    };

    const handleZoomIn = () => {
        setZoomScale(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoomScale(prev => Math.max(prev - 25, 50));
    };

    const handleZoomReset = () => {
        setZoomScale(100);
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            setZoomScale(100);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setZoomScale(100);
        }
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setIsAutoPlaying(false);
        }

        if (isRightSwipe && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            setIsAutoPlaying(false);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <>
            <div className="w-full max-w-md mx-auto lg:mx-0 space-y-4">
                {/* Main Image */}
                <div
                    className="relative aspect-[3/4] overflow-hidden luxury-glass border border-white/10 shadow-floating cursor-zoom-in rounded-sm touch-pan-y"
                    onClick={handleZoomOpen}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Image
                        src={images[currentImageIndex]}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-all duration-500 ease-out"
                        key={currentImageIndex}
                    />

                    {/* Zoom Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                        <FiZoomIn className="h-3.5 w-3.5 text-white/90" />
                        <span className="text-[10px] uppercase tracking-wider text-white/90 font-medium">Zoom</span>
                    </div>

                    {/* Image Counter - Mobile Only */}
                    <div className="absolute top-3 right-3 lg:hidden px-2.5 py-1.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                        <span className="text-[10px] uppercase tracking-wider text-white/90 font-medium">
                            {currentImageIndex + 1}/{images.length}
                        </span>
                    </div>

                    {/* Caption */}

                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => handleImageSelect(index)}
                                className={`
                  relative aspect-[3/4] overflow-hidden rounded-sm
                  border-2 transition-all duration-300
                  ${currentImageIndex === index
                                        ? 'border-white shadow-glow-violet-medium scale-105'
                                        : 'border-white/10 hover:border-white/30 hover:scale-102'
                                    }
                `}
                            >
                                <Image
                                    src={img}
                                    alt={`${title} - View ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 25vw, 12.5vw"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Zoom Modal - Fullscreen */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-[9999] bg-black"
                    onClick={() => setIsZoomed(false)}
                >
                    {/* Modal Container */}
                    <div className="h-full flex flex-col">

                        {/* Header */}
                        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 border-b border-white/10">
                            <div className="flex-1 min-w-0 pr-4">
                                <h2 className="text-white text-sm sm:text-base md:text-lg font-medium tracking-wide truncate">{title}</h2>
                                <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                                    {currentImageIndex + 1} of {images.length}
                                </p>
                            </div>
                            <button
                                className="flex-shrink-0 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsZoomed(false);
                                }}
                                aria-label="Close zoom"
                            >
                                <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 relative flex items-center justify-center px-4 sm:px-6 lg:px-10">

                            {/* Left Arrow - Large & Responsive */}
                            <button
                                className={`absolute left-2 sm:left-4 md:left-6 lg:left-8 p-3 text-white transition-all duration-200 z-30 ${currentImageIndex > 0
                                    ? 'hover:scale-110 opacity-100'
                                    : 'opacity-20 cursor-not-allowed'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (currentImageIndex > 0) handlePrevImage();
                                }}
                                disabled={currentImageIndex === 0}
                                aria-label="Previous image"
                            >
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Image Container - Ultra Responsive */}
                            <div
                                className="relative w-full h-full px-14 sm:px-20 md:px-24 lg:px-28 xl:px-32"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    className="relative w-full h-full transition-transform duration-300 ease-out"
                                    style={{ transform: `scale(${zoomScale / 100})` }}
                                >
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={title}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Right Arrow - Large & Responsive */}
                            <button
                                className={`absolute right-2 sm:right-4 md:right-6 lg:right-8 p-3 text-white transition-all duration-200 z-30 ${currentImageIndex < images.length - 1
                                    ? 'hover:scale-110 opacity-100'
                                    : 'opacity-20 cursor-not-allowed'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (currentImageIndex < images.length - 1) handleNextImage();
                                }}
                                disabled={currentImageIndex === images.length - 1}
                                aria-label="Next image"
                            >
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Zoom Controls - Fixed Bottom */}
                        <div className="flex-shrink-0 flex justify-center px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6">
                            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-black border border-white/20 shadow-2xl">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomOut();
                                    }}
                                    disabled={zoomScale <= 50}
                                    className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white"
                                    aria-label="Zoom out"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomReset();
                                    }}
                                    className="px-3 sm:px-4 py-1 text-white text-xs sm:text-sm font-medium hover:bg-white/10 active:bg-white/20 rounded transition-colors min-w-[55px] sm:min-w-[65px]"
                                    aria-label="Reset zoom to 100%"
                                >
                                    {zoomScale}%
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleZoomIn();
                                    }}
                                    disabled={zoomScale >= 200}
                                    className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-white"
                                    aria-label="Zoom in"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export const ProductImageGallery = memo(ProductImageGalleryComponent);
