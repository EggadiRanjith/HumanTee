"use client";

import { useEffect, useRef, useState } from "react";
import { FiUser, FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import Navbar from "./Navbar";
import { useHeaderContext } from "./useHeaderContext";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { totalItems } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const { setHeaderHeight } = useHeaderContext();
  const [open, setOpen] = useState(false);

  // Sync header height to global CSS var
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const h = ref.current.offsetHeight;
      setHeaderHeight(h);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setHeaderHeight]);

  // Auto-close menu when tapping outside
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const stop = (e: any) => e.stopPropagation(); // Prevent closing when touching inside menu

  return (
    <div
      ref={ref}
      id="site-header"
      className="
        fixed top-3 left-1/2 -translate-x-1/2
        w-full max-w-screen-2xl z-[9000]
        px-4 sm:px-6
      "
    >
      <header
        className="
          h-[56px] sm:h-[62px] md:h-[68px] lg:h-[74px]
          rounded-full luxury-glass backdrop-blur-xl
          border border-white/10
          shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]
          flex items-center justify-between px-5
          relative z-[9500]
        "
      >
        {/* MOBILE LEFT — MENU BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="md:hidden p-2 text-white/80 active:scale-95"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* BRAND LEFT */}
        <Link
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="
            text-white font-semibold uppercase tracking-[0.14em]
            text-[14px] sm:text-[15px]
            select-none
          "
          style={{ fontFamily: "var(--font-tan-pearl)" }}
        >
          HUMANTEE
        </Link>

        {/* RIGHT ICONS (MOBILE ONLY) */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" onClick={(e) => e.stopPropagation()} className="relative">
            <FiShoppingBag size={22} className="text-white/90" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-secondary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/profile" onClick={(e) => e.stopPropagation()}>
            <FiUser size={22} className="text-white/90" />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <Navbar large />
        </div>
      </header>

      {/* MOBILE OVERLAY + SLIDE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="
                fixed inset-0 
                z-[4000]
                md:hidden
                bg-transparent
                pointer-events-auto
              "
            />


            {/* SLIDE DOWN MENU */}
            <motion.div
              key="drawer"
              onClick={stop}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.3, 1] }}
              className="
                absolute top-[80px] left-0 right-0 mx-4
                md:hidden z-[5001]
                p-4 rounded-2xl
                luxury-glass backdrop-blur-xl 
                border border-white/10
                bg-brand-bg/90
              "
            >
              <nav className="flex flex-col gap-2 text-white/85">

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm hover:text-white hover:bg-white/5 rounded-lg"
                >
                  Home
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm hover:text-white hover:bg-white/5 rounded-lg"
                >
                  Shop
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm hover:text-white hover:bg-white/5 rounded-lg"
                >
                  Orders
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm hover:text-white hover:bg-white/5 rounded-lg"
                >
                  Profile
                </Link>

              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
