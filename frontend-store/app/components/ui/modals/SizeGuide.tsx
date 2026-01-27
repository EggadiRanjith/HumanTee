"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiX, FiInfo, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSettings } from "@/app/contexts/SettingsContext";
import { FocusTrap } from "@/app/components/ui/accessibility/FocusTrap";

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Get product-info settings from centralized cache
    const { settings: allSettings } = useSettings();
    const settings = allSettings?.['product-info'];

    // Extract size guide images from settings
    useEffect(() => {
        if (settings?.size_guide_images) {
            const gallery = settings.size_guide_images;
            setImages(Array.isArray(gallery) ? gallery : []);
        } else if (settings?.size_guide_image) {
            // Fallback for single image
            setImages([settings.size_guide_image]);
        }
    }, [settings]);

    // Robust body scroll lock
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Lock scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                // Restore scroll
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                const scrollPos = parseInt(scrollY || '0') * -1;
                if (!isNaN(scrollPos)) {
                    window.scrollTo(0, scrollPos);
                }
            };
        }
    }, [isOpen]);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <FocusTrap isActive={isOpen} onEscape={onClose}>
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-3 md:p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-3xl max-h-[95vh] flex flex-col bg-[#050512] border border-white/10 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden text-white"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-[#050512]/80 border-b border-white/10 backdrop-blur-xl p-3 sm:p-4 md:p-5 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-base sm:text-lg md:text-xl font-light tracking-wide">Size Guide</h2>
                                    <p className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest mt-0.5">Measurements & Fit</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Close size guide"
                                    className="p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                                >
                                    <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 md:p-4 custom-scrollbar">
                                <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
                                    {/* Image Container */}
                                    <div className="w-full relative min-h-[250px] sm:min-h-[300px] flex items-center justify-center bg-zinc-900/50 rounded-lg sm:rounded-xl border border-white/5 group">
                                        <AnimatePresence mode="wait">
                                            {images.length > 0 ? (
                                                <motion.div
                                                    key={currentIndex}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="w-full h-full flex items-center justify-center p-2"
                                                >
                                                    <Image
                                                        src={images[currentIndex]}
                                                        alt={`Size Chart ${currentIndex + 1}`}
                                                        width={800}
                                                        height={600}
                                                        className="max-w-full max-h-[50vh] sm:max-h-[60vh] object-contain rounded-md sm:rounded-lg shadow-2xl"
                                                        loading="lazy"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                                    <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 border border-violet-500/20">
                                                        <FiInfo className="w-8 h-8 text-violet-400" />
                                                    </div>
                                                    <h3 className="text-white/80 font-medium text-lg mb-2">Size Chart Coming Soon</h3>
                                                    <p className="text-white/40 text-sm max-w-[300px] leading-relaxed">
                                                        We are currently updating our size diagrams to ensure you get the perfect fit.
                                                    </p>
                                                </div>
                                            )}
                                        </AnimatePresence>

                                        {/* Responsive Navigation Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-2 sm:left-4 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all backdrop-blur-md border border-white/10 group-hover:translate-x-1"
                                                >
                                                    <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-2 sm:right-4 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all backdrop-blur-md border border-white/10 group-hover:-translate-x-1"
                                                >
                                                    <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>

                                                {/* Counter / Dots */}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                                    {images.map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentIndex(i)}
                                                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-violet-400 w-4' : 'bg-white/30 hover:bg-white/50'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Fit Info Footer */}
                                    <div className="w-full bg-violet-500/5 border border-violet-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                        <div className="flex gap-2.5 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-violet-500/10 flex-shrink-0 flex items-center justify-center">
                                                <FiInfo className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-violet-400" />
                                            </div>
                                            <div className="text-xs sm:text-sm">
                                                <p className="text-violet-300 font-medium mb-0.5 sm:mb-1 uppercase tracking-wider text-[10px] sm:text-[11px]">Fit Recommendation</p>
                                                <p className="text-white/60 leading-relaxed text-[11px] sm:text-sm">
                                                    For the most accurate fit, measure your favorite t-shirt and compare with the chart above. Standard unisex sizing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </FocusTrap>
            )}
        </AnimatePresence>
    );
}
