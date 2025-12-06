"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import NavLink from "./NavLink";
import Navbar from "./Navbar";
import { FiHeart } from "react-icons/fi";
import { useHeaderContext } from "./useHeaderContext";

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { setHeaderHeight } = useHeaderContext();

  // Update header height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [setHeaderHeight]);

  return (
    <motion.div
      ref={headerRef}
      initial={{ y: -26, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.3, 1] }}
      className="
        fixed
        top-3 xs:top-4 sm:top-4 md:top-5 lg:top-6
        left-1/2 -translate-x-1/2
        w-full
        max-w-screen-2xl
        px-3 xs:px-4 sm:px-4 md:px-6
        z-[5000]
        safe-area-top
      "
    >
      <header
        className="
          relative
          h-12 xs:h-13 sm:h-14 md:h-16 lg:h-[72px]
          px-3 xs:px-4 sm:px-5 md:px-6
          flex items-center justify-between
          rounded-full
          luxury-glass
          border border-white/12
          shadow-[0_0_40px_-10px_rgba(0,0,0,0.55)]
          backdrop-blur-2xl
          overflow-hidden
          min-h-[48px]
        "
      >
        {/* Light sweep animation (desktop/tablet only) */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <motion.div
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              filter: "blur(32px)",
            }}
            animate={{ x: ["-40%", "140%"] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: [0.25, 1, 0.3, 1] }}
            className="absolute inset-0"
          />
        </div>

        {/* Soft inner glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 0 26px rgba(255,255,255,0.06)" }}
        />

        {/* DESKTOP NAV (lg+) */}
        <nav className="hidden lg:flex items-center justify-between w-full">
          {/* Brand left */}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.3, 1] }}
            className="
              text-[14px] lg:text-[16px] xl:text-[17px]
              font-semibold
              tracking-[0.10em] sm:tracking-[0.12em] lg:tracking-[0.14em]
              uppercase brand-text-primary select-none
            "
            style={{ fontFamily: "var(--font-tan-pearl)" }}
          >
            HUMANTEE
          </motion.h1>

          {/* Navigation right */}
          <Navbar />
        </nav>

        {/* TABLET NAV (768px - 1023px) */}
        <nav className="hidden md:flex lg:hidden w-full items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.3, 1] }}
            className="
              text-[13px] sm:text-[14px]
              font-semibold
              tracking-[0.10em] sm:tracking-[0.12em]
              uppercase brand-text-primary select-none
            "
            style={{ fontFamily: "var(--font-tan-pearl)" }}
          >
            HUMANTEE
          </motion.h1>

          <Navbar />
        </nav>

        {/* MOBILE NAV (< 768px) - Brand left, Wishlist icon right */}
        <div className="md:hidden flex items-center justify-between w-full">
          {/* Brand left */}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.3, 1] }}
            className="
              text-[13px] xs:text-[14px] sm:text-[15px]
              font-semibold
              tracking-[0.08em] xs:tracking-[0.10em]
              uppercase brand-text-primary select-none
            "
            style={{ fontFamily: "var(--font-tan-pearl)" }}
          >
            HUMANTEE
          </motion.h1>

          {/* Wishlist icon right */}
          <NavLink href="/wishlist">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center touch-target"
            >
              <FiHeart size={22} className="text-brand-primary" />
            </motion.div>
          </NavLink>
        </div>
      </header>
    </motion.div>
  );
}
