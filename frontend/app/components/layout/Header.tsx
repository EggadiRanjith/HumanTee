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

  // Auto-close menu when tapping outside or scrolling
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    // Removed touchmove/scroll listeners as they were causing immediate closing sensitivity on mobile
    return () => {
      window.removeEventListener("click", close);
    };
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
          aria-label="Navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
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

        {/* MIDDLE NAV (DESKTOP ONLY) - Shop, Orders, Contact */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/shop"
            className="
              uppercase
              tracking-[0.20em]
              transition-all duration-300
              text-white/60 hover:text-white
              text-[14px] xl:text-[15px]
              py-1.5
            "
          >
            SHOP
          </Link>
          <Link
            href="/orders"
            className="
              uppercase
              tracking-[0.20em]
              transition-all duration-300
              text-white/60 hover:text-white
              text-[14px] xl:text-[15px]
              py-1.5
            "
          >
            ORDERS
          </Link>
          <Link
            href="/contact"
            className="
              uppercase
              tracking-[0.20em]
              transition-all duration-300
              text-white/60 hover:text-white
              text-[14px] xl:text-[15px]
              py-1.5
            "
          >
            CONTACT US
          </Link>
        </div>

        {/* RIGHT SECTION - Profile & Cart */}
        <div className="flex items-center gap-6">
          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/profile" onClick={(e) => e.stopPropagation()}>
              <FiUser size={22} className="text-white/90" />
            </Link>
            <Link
              href="/cart"
              onClick={(e) => e.stopPropagation()}
              className="relative p-1"
              aria-label={`Shopping cart with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
            >
              <FiShoppingBag size={22} className="text-white/90" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.4)] border border-black/10 z-10 px-0.5"
                    role="status"
                    aria-live="polite"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Screen reader announcement for cart updates */}
            <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {totalItems > 0 && `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in shopping cart`}
            </div>
          </div>

          {/* Desktop Nav - Profile & Cart Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/profile"
              className="
                transition-all duration-300
                text-white/70 hover:text-white
                hover:scale-110
                hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
                p-1
              "
              title="Profile"
            >
              <FiUser size={28} />
            </Link>
            <Link
              href="/cart"
              className="
                relative
                transition-all duration-300
                text-white/70 hover:text-white
                hover:scale-110
                hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
                p-1
              "
              title="Cart"
            >
              <FiShoppingBag size={28} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] bg-white text-black text-[11px] font-bold rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.6)] border border-black/10 z-10 px-0.5"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
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
              id="mobile-nav"
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
              <nav className="flex flex-col gap-2 text-white/85" role="navigation" aria-label="Mobile navigation menu">

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
