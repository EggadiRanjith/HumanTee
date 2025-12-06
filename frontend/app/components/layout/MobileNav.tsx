"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeaderContext } from "./useHeaderContext";

const menuItems = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/orders", label: "ORDERS" },
  { href: "/profile", label: "PROFILE" },
];

export default function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const { isDrawerOpen, setIsDrawerOpen } = useHeaderContext();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen, setIsDrawerOpen]);

  const drawerContent = (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: 999998 }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          </motion.div>

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[85vw] max-w-sm md:hidden flex flex-col luxury-glass border-l border-white/15 shadow-2xl safe-area-right"
            style={{
              zIndex: 999999,
              position: "fixed",
              isolation: "isolate",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) {
                setIsDrawerOpen(false);
              }
            }}
          >
            {/* Aurora background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 20% 30%, rgba(183,164,255,0.15), transparent 60%),
                    radial-gradient(circle at 80% 70%, rgba(70,230,255,0.12), transparent 55%)
                  `,
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Header section */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 xs:px-6 pt-5 xs:pt-6 pb-4 border-b border-white/10 relative z-10">
              <h2
                className="text-xl xs:text-2xl font-semibold uppercase tracking-[0.12em] brand-text-primary"
                style={{ fontFamily: "var(--font-tan-pearl)" }}
              >
                MENU
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="
                  w-11 h-11
                  luxury-glass
                  border border-white/15
                  rounded-full
                  flex items-center justify-center
                  touch-target
                  hover:border-white/25
                  transition-colors
                  relative
                  group
                "
                aria-label="Close menu"
              >
                <motion.span
                  animate={{ rotate: 45 }}
                  className="text-3xl brand-text-primary font-light"
                />
                {/* Neon glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    boxShadow: "0 0 20px rgba(183,164,255,0.4)",
                  }}
                />
              </button>
            </div>

            {/* Scrollable menu items */}
            <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch relative z-10">
              <nav className="flex flex-col px-5 xs:px-6 py-4 gap-1">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.25, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`
                          relative
                          block
                          w-full
                          px-5
                          py-4
                          rounded-xl
                          text-base
                          font-geist
                          font-medium
                          uppercase
                          tracking-[0.12em]
                          min-h-[52px]
                          flex items-center
                          transition-all
                          duration-200
                          border border-transparent
                          ${
                            isActive
                              ? "brand-text-primary bg-white/10 border-white/20"
                              : "brand-text-muted hover:brand-text-primary hover:bg-white/5 hover:border-white/10"
                          }
                          active:scale-[0.98]
                        `}
                      >
                        <span className="relative z-10">{item.label}</span>
                        
                        {/* Neon glow for active */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl opacity-50"
                            style={{
                              boxShadow: "inset 0 0 30px rgba(183,164,255,0.2)",
                            }}
                            animate={{
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        {/* Hover gradient */}
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100"
                          whileHover={{ opacity: 1 }}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 xs:px-6 py-4 xs:py-5 border-t border-white/10 safe-area-bottom relative z-10">
              <p className="text-xs brand-text-dim text-center">
                © 2024 HUMANTEE
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="
          md:hidden
          w-11 h-11
          flex items-center justify-center
          rounded-xl
          luxury-glass
          border border-white/15
          touch-target
          hover:border-white/25
          transition-colors
          relative
          group
        "
        aria-label="Open menu"
        aria-expanded={isDrawerOpen}
      >
        <motion.div
          className="w-6 h-6 flex flex-col justify-between"
          animate={isDrawerOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="block h-0.5 bg-white rounded-full"
            animate={isDrawerOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-0.5 bg-white rounded-full"
            animate={isDrawerOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-0.5 bg-white rounded-full"
            animate={isDrawerOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        {/* Neon glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            boxShadow: "0 0 15px rgba(183,164,255,0.3)",
          }}
        />
      </button>

      {/* Portal drawer */}
      {mounted && typeof window !== "undefined" && createPortal(drawerContent, document.body)}
    </>
  );
}
