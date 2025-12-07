"use client";

import Link from "next/link";
import { FiInstagram, FiTwitter, FiGithub } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      className="
        relative w-full
        pt-8 pb-5
        px-5 sm:px-6 md:px-10 lg:px-12
        border-t border-white/10
        bg-brand-bg
        overflow-hidden
      "
    >
      {/* Subtle Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(160,140,255,0.10), transparent 70%)",
          filter: "blur(55px)",
        }}
        animate={{ opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* GRID — MOBILE: CENTERED 2 COL | DESKTOP: 4 COL */}
      <div
        className="
          relative max-w-screen-xl mx-auto
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
          gap-8 sm:gap-10
        "
      >
        {/* BRAND COLUMN — CENTERED ON MOBILE */}
        <div
          className="
            flex flex-col gap-3 col-span-2 sm:col-span-1
            text-center sm:text-left 
            items-center sm:items-start
          "
        >
          <h2
            className="
              text-white tracking-[0.14em] uppercase
              text-[14px] sm:text-[15px]
              font-semibold
            "
            style={{ fontFamily: "var(--font-tan-pearl)" }}
          >
            HUMANTEE
          </h2>

          <p className="text-white/60 text-[12px] max-w-xs leading-relaxed">
            A luxury shopping experience crafted with minimalist precision.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            {[FiInstagram, FiTwitter, FiGithub].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="
                  w-8 h-8 flex items-center justify-center
                  rounded-full border border-white/10
                  hover:border-white/20 hover:bg-white/5
                  transition-all
                "
              >
                <Icon size={15} className="text-white/70" />
              </Link>
            ))}
          </div>
        </div>

        {/* SHOP COLUMN */}
        <div className="text-center sm:text-left">
          <h3 className="text-white text-[12px] uppercase tracking-[0.12em] mb-3">
            Shop
          </h3>
          <ul className="space-y-1.5 text-white/60 text-[12px]">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/orders">Orders</Link></li>
            <li><Link href="/coming-soon">Coming Soon</Link></li>
          </ul>
        </div>

        {/* SUPPORT COLUMN */}
        <div className="text-center sm:text-left">
          <h3 className="text-white text-[12px] uppercase tracking-[0.12em] mb-3">
            Support
          </h3>
          <ul className="space-y-1.5 text-white/60 text-[12px]">
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/shipping">Shipping</Link></li>
          </ul>
        </div>

        {/* Desktop Balancer */}
        <div className="hidden lg:block"></div>
      </div>

      {/* BOTTOM — CENTERED, CLEAN, MINIMAL */}
      <div
        className="
          relative max-w-screen-xl mx-auto
          mt-6 pt-3
          border-t border-white/10
          flex justify-center
        "
      >
        <p className="text-white/50 text-[11px] tracking-widest text-center">
          © {new Date().getFullYear()} HUMANTEE
        </p>
      </div>
    </footer>
  );
}
