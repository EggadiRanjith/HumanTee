/**
 * Mobile Navigation Menu Component
 * Extracted from Header for better maintainability
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NAV_LINKS, HEADER_Z_INDEX } from "../constants";
import type { MobileMenuProps } from "../types";

export default function MobileMenu({ open, onClose, headerHeight }: MobileMenuProps) {
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <motion.div
                key="overlay"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 md:hidden bg-black/20 backdrop-blur-sm pointer-events-auto"
                style={{ zIndex: HEADER_Z_INDEX.OVERLAY }}
            />

            {/* Menu Drawer */}
            <motion.nav
                key="drawer"
                id="mobile-nav"
                onClick={stopPropagation}
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.3, 1] }}
                className="
          absolute left-0 right-0 mx-3 sm:mx-4
          md:hidden
          p-3 sm:p-4 rounded-2xl
          luxury-glass backdrop-blur-xl 
          border border-white/10
          bg-brand-bg/90
        "
                style={{
                    top: `${headerHeight + 8}px`,
                    zIndex: HEADER_Z_INDEX.MENU,
                }}
                role="navigation"
                aria-label="Mobile navigation menu"
            >
                <div className="flex flex-col gap-2 text-white/85">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="px-3 py-3 text-sm hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </motion.nav>
        </>
    );
}
