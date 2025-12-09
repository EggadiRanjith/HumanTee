"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiInstagram } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import ScrollingText from "./ScrollingText";

export default function Footer() {
  const [shopOpen, setShopOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const shopRef = useRef<HTMLDivElement | null>(null);
  const supportRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setShopOpen(false);
    setSupportOpen(false);
  }, [pathname]);

  // Close dropdowns when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      // 1024px is the lg breakpoint in tailwind
      if (window.innerWidth >= 1024) {
        setShopOpen(false);
        setSupportOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    // Also check on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll when dropdown opens
  const scrollToView = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    setTimeout(() => {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  useEffect(() => {
    if (shopOpen) {
      scrollToView(shopRef.current);
    }
  }, [shopOpen]);
  useEffect(() => {
    if (supportOpen) {
      scrollToView(supportRef.current);
    }
  }, [supportOpen]);

  // Apple dropdown animation
  const dropdownAnim = {
    hidden: { opacity: 0, height: 0, y: -8, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] as const },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -6,
      filter: "blur(6px)",
      transition: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
    },
  };

  return (
    <>
      <footer
        className="
          relative w-full 
          pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-10 lg:pb-8
          px-5 sm:px-6 md:px-10 lg:px-12
          border-t border-white/10
          bg-brand-bg
        "
      >
        {/* Glow */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 40% 10%, rgba(140,120,255,0.12), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* CONTENT GRID */}
        <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* ---------- BRAND COLUMN ---------- */}
          <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
            <h2
              className="text-[14px] text-white tracking-[0.15em] uppercase font-semibold"
              style={{ fontFamily: "var(--font-tan-pearl)" }}
            >
              HUMANTEE
            </h2>

            <p className="text-white/60 text-[12px] leading-relaxed max-w-xs">
              A luxury shopping experience crafted with minimalist precision.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-white/50 text-[11px] tracking-[0.2em] uppercase">
                Follow Us
              </span>

              <Link
                href="https://www.instagram.com/humanteeofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-8 h-8 flex items-center justify-center 
                  rounded-full border border-white/10 
                  hover:border-white/30 hover:bg-white/5 
                  transition-all
                "
              >
                <FiInstagram size={15} className="text-white/75" />
              </Link>
            </div>
          </div>

          {/* ---------- SHOP COLUMN ---------- */}
          <div ref={shopRef}>
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="lg:hidden flex justify-between items-center w-full text-white text-[12px] tracking-[0.12em] uppercase"
            >
              Shop <span>{shopOpen ? "−" : "+"}</span>
            </button>

            <h3 className="hidden lg:block text-[12px] text-white uppercase tracking-[0.12em] mb-2">
              Shop
            </h3>

            <AnimatePresence>
              {(shopOpen || (isClient && window.innerWidth >= 1024)) && (
                <motion.div
                  variants={dropdownAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-[12px] text-white/60"
                >
                  {[
                    { name: "Orders", url: "/orders" },
                    { name: "Profile", url: "/profile" },
                    { name: "All Products", url: "/shop" },
                    { name: "Featured Projects", url: "/featured" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className="block py-2 border-b border-white/10 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---------- SUPPORT COLUMN ---------- */}
          <div ref={supportRef}>
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              className="lg:hidden flex justify-between items-center w-full text-white text-[12px] tracking-[0.12em] uppercase"
            >
              Support <span>{supportOpen ? "−" : "+"}</span>
            </button>

            <h3 className="hidden lg:block text-[12px] text-white uppercase tracking-[0.12em] mb-2">
              Support
            </h3>

            <AnimatePresence>
              {(supportOpen || (isClient && window.innerWidth >= 1024)) && (
                <motion.div
                  variants={dropdownAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-[12px] text-white/60"
                >
                  {[
                    { name: "Shipping", url: "/shipping" },
                    { name: "Terms & Privacy", url: "/terms-privacy" },
                    { name: "+91 7780-661493", url: "tel:+917780661493" },
                    { name: "humanteeofficial@gmail.com", url: "mailto:humanteeofficial@gmail.com" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.url}
                      className="block py-2 border-b border-white/10 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </footer>

      {/* Scrolling Text Section - Separate from footer */}
      <ScrollingText />

      {/* COPYRIGHT - Below scrolling text */}
      <div className="relative w-full bg-brand-bg border-t border-white/10">
        <div className="max-w-screen-xl mx-auto py-4 text-center">
          <p className="text-white/50 text-[11px] tracking-[0.2em]">
            © {new Date().getFullYear()} HUMANTEE
          </p>
        </div>
      </div>
    </>
  );
}
