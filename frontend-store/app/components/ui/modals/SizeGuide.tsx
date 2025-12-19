/**
 * Size Guide Modal
 * Helps customers choose the right size with measurement charts
 */

"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { FiX, FiInfo } from "react-icons/fi";

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const sizeChart = [
    { size: "XS", chest: "34-36", length: "27", shoulder: "16" },
    { size: "S", chest: "36-38", length: "28", shoulder: "17" },
    { size: "M", chest: "38-40", length: "29", shoulder: "18" },
    { size: "L", chest: "40-42", length: "30", shoulder: "19" },
    { size: "XL", chest: "42-44", length: "31", shoulder: "20" },
    { size: "XXL", chest: "44-46", length: "32", shoulder: "21" },
];

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
    const [activeTab, setActiveTab] = useState<"chart" | "measure" | "fit">("chart");

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
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-gradient-to-br from-[#0d0d1e] to-[#050512] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#0d0d1e]/95 border-b border-white/10 backdrop-blur-xl p-4 sm:p-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">Size Guide</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <FiX className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {[
                            { id: "chart", label: "Size Chart" },
                            { id: "measure", label: "How to Measure" },
                            { id: "fit", label: "Fit Guide" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white"
                                    : "bg-white/5 text-white/60 hover:text-white/80"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
                    {/* Size Chart Tab */}
                    {activeTab === "chart" && (
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-lg p-1">
                                <p className="text-white/70 text-sm mb-4 p-3">
                                    All measurements are in inches. For the best fit, measure your favorite t-shirt and compare.
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left p-3 text-white font-medium">Size</th>
                                                <th className="text-left p-3 text-white font-medium">Chest (inches)</th>
                                                <th className="text-left p-3 text-white font-medium">Length (inches)</th>
                                                <th className="text-left p-3 text-white font-medium">Shoulder (inches)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sizeChart.map((row, idx) => (
                                                <tr
                                                    key={row.size}
                                                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? "bg-white/[0.02]" : ""
                                                        }`}
                                                >
                                                    <td className="p-2 sm:p-3 text-white font-semibold text-sm sm:text-base">{row.size}</td>
                                                    <td className="p-2 sm:p-3 text-white/80 text-sm sm:text-base">{row.chest}</td>
                                                    <td className="p-2 sm:p-3 text-white/80 text-sm sm:text-base">{row.length}</td>
                                                    <td className="p-2 sm:p-3 text-white/80 text-sm sm:text-base">{row.shoulder}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4 flex gap-3">
                                <FiInfo className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-white/90 font-medium mb-1">Between sizes?</p>
                                    <p className="text-white/70">We recommend sizing up for a relaxed fit, or down for a fitted look.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* How to Measure Tab */}
                    {activeTab === "measure" && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-white font-medium text-lg">Measurement Instructions</h3>

                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                1
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Chest</p>
                                                <p className="text-white/70 text-sm">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                2
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Length</p>
                                                <p className="text-white/70 text-sm">Measure from the highest point of the shoulder to the hem.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                3
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Shoulder</p>
                                                <p className="text-white/70 text-sm">Measure from shoulder seam to shoulder seam across the back.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                                    <div className="text-center text-white/60">
                                        <p className="text-sm">Measurement diagram</p>
                                        <p className="text-xs mt-1">(Illustration placeholder)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-4">
                                <p className="text-white/90 font-medium mb-2">Pro Tip</p>
                                <p className="text-white/70 text-sm">
                                    For the most accurate fit, lay your favorite t-shirt flat and measure it, then compare with our size chart.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Fit Guide Tab */}
                    {activeTab === "fit" && (
                        <div className="space-y-6">
                            <div className="grid gap-4">
                                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                                    <h3 className="text-white font-medium text-lg mb-2">Regular Fit</h3>
                                    <p className="text-white/70 text-sm mb-3">
                                        Our standard fit. Not too tight, not too loose. Perfect for everyday wear.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">Recommended</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                                    <h3 className="text-white font-medium text-lg mb-2">Relaxed Fit</h3>
                                    <p className="text-white/70 text-sm mb-3">
                                        Order one size up for a looser, more comfortable fit with extra breathing room.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-xs">Size up</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                                    <h3 className="text-white font-medium text-lg mb-2">Fitted Look</h3>
                                    <p className="text-white/70 text-sm mb-3">
                                        Order one size down for a more tailored, body-hugging fit.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-xs">Size down</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-white/10 rounded-lg p-4">
                                <p className="text-white/90 font-medium mb-2">Still unsure?</p>
                                <p className="text-white/70 text-sm">
                                    Contact our customer support team for personalized sizing advice. We're happy to help!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
