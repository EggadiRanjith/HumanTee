/**
 * Footer Navigation Section with Accordion
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { NavSection } from "../types";
import { FOCUS_RING } from "../../shared/design-tokens";

interface FooterNavProps {
    section: NavSection;
    isDesktop: boolean;
}

export default function FooterNav({ section, isDesktop }: FooterNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const contentId = `footer-nav-${section.title.toLowerCase().replace(/\s+/g, '-')}`;

    // Auto-close on desktop
    useEffect(() => {
        if (isDesktop) {
            setIsOpen(false);
        }
    }, [isDesktop]);

    // Scroll into view when opened
    useEffect(() => {
        if (isOpen && contentRef.current) {
            setTimeout(() => {
                contentRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500);
        }
    }, [isOpen]);

    // Esc key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    // Optimized toggle handler
    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return (
        <div ref={containerRef}>
            <button
                onClick={handleToggle}
                className="
                    sm:hidden flex justify-between items-center w-full 
                    text-white text-[12px] tracking-[0.12em] uppercase
                    hover:text-white/80 transition-colors duration-200
                    py-2 border-b border-white/10
                    ${FOCUS_RING.subtle}
                "
                aria-expanded={isOpen}
                aria-controls={contentId}
                aria-label={`Toggle ${section.title} menu`}
            >
                {section.title}
                <motion.span
                    className="text-[16px]"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    aria-hidden="true"
                >
                    +
                </motion.span>
            </button>

            <h3 className="hidden sm:block text-[12px] text-white uppercase tracking-[0.12em] mb-2">
                {section.title}
            </h3>

            {/* Mobile Accordion */}
            <AnimatePresence initial={false}>
                {(isOpen || isDesktop) && (
                    <motion.div
                        ref={contentRef}
                        id={contentId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                        }}
                        className="overflow-hidden text-[12px] text-white/60"
                    >
                        {section.links.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <Link
                                    href={link.url}
                                    className="
                                        block py-2 border-b border-white/10 
                                        hover:text-white hover:pl-2
                                        transition-all duration-300
                                        relative group
                                    "
                                >
                                    {link.name}
                                    <span className="
                                        absolute bottom-0 left-0 h-[1px] bg-white/30
                                        w-0 group-hover:w-full transition-all duration-300
                                    " />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
