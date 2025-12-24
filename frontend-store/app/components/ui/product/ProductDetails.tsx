"use client";

import { useState } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsProps {
    description: string;
    details: string[];
    pageSettings?: {
        material_care?: string[];
        shipping_returns?: string[];
        size_fit?: string[];
    };
}

interface AccordionItemProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
    return (
        <div className="border-t border-white/10">
            <button
                type="button"
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between group transition-colors"
                aria-expanded={isOpen}
            >
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-white/70 group-hover:text-white transition-colors">
                    {title}
                </span>
                <span className={`text-white/30 group-hover:text-white/60 transition-all duration-300 ${isOpen ? "rotate-45 text-violet-400" : ""}`}>
                    <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 text-white/60 text-[13px] sm:text-[14px] leading-relaxed space-y-3 font-light">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ProductDetails({ description, details, pageSettings }: ProductDetailsProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Robust data extraction with array checks
    const getList = (data: any, fallback: string[]) => {
        if (Array.isArray(data) && data.length > 0) return data;
        return fallback;
    };

    const material_care = getList(pageSettings?.material_care, [
        "100% Premium Cotton",
        "Pre-shrunk fabric",
        "Machine wash cold with like colors",
        "Do not bleach • Tumble dry low",
        "Iron inside out if needed"
    ]);

    const shipping_returns = getList(pageSettings?.shipping_returns, [
        "Free shipping on orders over ₹2,000",
        "Standard delivery: 3-4 business days",
        "Express delivery available",
        "30-day return policy",
        "Easy exchanges available"
    ]);

    const size_fit = getList(pageSettings?.size_fit, [
        "Unisex relaxed fit",
        "True to size",
        "Premium build quality"
    ]);

    return (
        <div className="pt-8 space-y-10">
            {/* Description / Narrative Section */}
            {(description || (details && details.length > 0)) && (
                <div className="space-y-4">
                    <h3 className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-bold">
                        The Narrative
                    </h3>
                    <div className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed font-light space-y-5">
                        {description && (
                            <p className="first-letter:text-2xl first-letter:font-serif first-letter:mr-1">
                                {description}
                            </p>
                        )}
                        {details && details.length > 0 && (
                            <ul className="space-y-3 list-none">
                                {details.map((detail, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500/40 mt-1.5 flex-shrink-0" />
                                        <span className="text-white/70">{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Accordions */}
            <div className="border-b border-white/10">
                <AccordionItem
                    title="Material & Care"
                    isOpen={openSection === "material"}
                    onToggle={() => toggleSection("material")}
                >
                    <ul className="space-y-3">
                        {material_care.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <span className="text-violet-400/30 text-xs mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>

                <AccordionItem
                    title="Shipping & Returns"
                    isOpen={openSection === "shipping"}
                    onToggle={() => toggleSection("shipping")}
                >
                    <ul className="space-y-3">
                        {shipping_returns.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <span className="text-violet-400/30 text-xs mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>

                <AccordionItem
                    title="Size & Fit"
                    isOpen={openSection === "fit"}
                    onToggle={() => toggleSection("fit")}
                >
                    <ul className="space-y-3">
                        {size_fit.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <span className="text-violet-400/30 text-xs mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionItem>
            </div>
        </div>
    );
}

