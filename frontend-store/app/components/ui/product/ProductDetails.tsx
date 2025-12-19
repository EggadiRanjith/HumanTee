"use client";

import { useState } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { m, AnimatePresence } from "framer-motion";

interface ProductDetailsProps {
    description: string;
    details: string[];
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
                className="w-full py-4 flex items-center justify-between group"
            >
                <span className="text-xs uppercase tracking-[0.15em] font-medium text-white/90 group-hover:text-white transition-colors">
                    {title}
                </span>
                <span className={`text-white/40 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    <FiPlus className="w-4 h-4" />
                </span>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="pb-6 text-white/60 text-[0.9rem] leading-relaxed space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ProductDetails({ description, details }: ProductDetailsProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="pt-6 space-y-8">
            {/* Description */}
            <div>
                <h3 className="text-white/40 text-xs uppercase tracking-[0.15em] mb-3">
                    Description
                </h3>
                <p className="text-white/80 text-[0.95rem] leading-relaxed font-light">
                    {description}
                </p>
            </div>

            {/* Accordions */}
            <div className="border-b border-white/10">
                <AccordionItem
                    title="Material & Care"
                    isOpen={openSection === "material"}
                    onToggle={() => toggleSection("material")}
                >
                    <ul className="space-y-2 list-disc list-outside ml-4 marker:text-white/30">
                        <li>100% Premium Cotton</li>
                        <li>Pre-shrunk fabric</li>
                        <li>Machine wash cold with like colors</li>
                        <li>Do not bleach • Tumble dry low</li>
                        <li>Iron inside out if needed</li>
                    </ul>
                </AccordionItem>

                <AccordionItem
                    title="Shipping & Returns"
                    isOpen={openSection === "shipping"}
                    onToggle={() => toggleSection("shipping")}
                >
                    <ul className="space-y-2 list-disc list-outside ml-4 marker:text-white/30">
                        <li>Free shipping on orders over ₹2,000</li>
                        <li>Standard delivery: 3-4 business days</li>
                        <li>Express delivery available</li>
                        <li>30-day return policy</li>
                        <li>Easy exchanges available</li>
                    </ul>
                </AccordionItem>

                <AccordionItem
                    title="Size & Fit"
                    isOpen={openSection === "fit"}
                    onToggle={() => toggleSection("fit")}
                >
                    <ul className="space-y-2 list-disc list-outside ml-4 marker:text-white/30">
                        <li>Unisex relaxed fit</li>
                        <li>True to size</li>
                        <li>Model is 6'0" wearing size M</li>
                        <li>Chest: 21" (size M)</li>
                        <li>Length: 28" (size M)</li>
                    </ul>
                </AccordionItem>
            </div>
        </div>
    );
}
