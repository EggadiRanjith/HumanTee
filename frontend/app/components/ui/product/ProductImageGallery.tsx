/**
 * Product Image Gallery
 * Image carousel with zoom, thumbnails, and swipe support
 */

"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiZoomIn, FiX } from 'react-icons/fi';

interface ProductImageGalleryProps {
    images: string[];
    title: string;
    subtitle: string;
    productId: number;
}

export function ProductImageGallery({ images, title, subtitle, productId }: ProductImageGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Auto-transition images every 3 seconds
    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1 || isZoomed) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

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

    const handleImageSelect = (index: number) => {
        setCurrentImageIndex(index);
        setIsAutoPlaying(false);
    };

    const handleZoomOpen = () => {
        setIsAutoPlaying(false);
        setIsZoomed(true);
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
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/75">
                        <span className="truncate">{subtitle.split(" • ")[0]}</span>
                        <span>{String(productId).padStart(2, "0")}</span>
                    </div>
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

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 pt-[calc(var(--header-height)+1rem)]"
                    onClick={() => setIsZoomed(false)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors z-10"
                        style={{ top: 'calc(var(--header-height) + 1rem)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(false);
                        }}
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    {/* Swipe Indicator - Mobile Only */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 lg:hidden"
                        style={{ top: 'calc(var(--header-height) + 1rem)' }}
                    >
                        <div className="w-12 h-1 rounded-full bg-white/30"></div>
                    </div>

                    {/* Zoomed Image */}
                    <div
                        className="relative w-full h-full max-w-5xl max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentImageIndex]}
                            alt={title}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Image Info */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                        <p className="text-white/90 text-xs uppercase tracking-wider">
                            {currentImageIndex + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
