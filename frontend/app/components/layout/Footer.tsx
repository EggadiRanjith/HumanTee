"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiInstagram, FiTwitter, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      className="
        relative w-full
        pt-12 sm:pt-16 pb-8 sm:pb-12
        px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20
        overflow-hidden
      "
    >
      {/* ✦ Soft Cinematic Back Glow (subtle + compact) */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(160,140,255,0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ opacity: [0.25, 0.38, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* MAIN GRID → Compact spacing */}
      <div
        className="
          relative max-w-7xl xl:max-w-screen-2xl 2xl:max-w-screen-xl mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6 sm:gap-8 lg:gap-12 xl:gap-16
          items-start
        "
      >
        {/* BRAND COLUMN – Compact spacing */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
          <h2
            className="
              text-[14px] sm:text-[15px] lg:text-[16px] xl:text-[17px] font-semibold
              tracking-[0.12em] uppercase
              brand-text-primary
            "
          >
            Humantee
          </h2>

          <p className="brand-text-muted text-xs sm:text-[13px] lg:text-[14px] leading-relaxed max-w-xs lg:max-w-sm xl:max-w-md">
            A luxury shopping experience crafted with cinematic precision. Discover unparalleled quality and sophisticated design.
          </p>

          {/* Social icons with compact spacing */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mt-4 sm:mt-6">
            {[FiInstagram, FiTwitter, FiGithub].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className="
                  w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 flex items-center justify-center
                  rounded-full luxury-glass border border-white/10
                  hover:border-brand-primary/40
                  transition-all duration-300
                "
              >
                <Icon className="text-brand-primary" size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* SHOP + SUPPORT (Compact spacing) */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
            {/* SHOP */}
            <div>
              <h3
                className="
                  text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-semibold uppercase tracking-[0.1em]
                  brand-text-primary mb-4 sm:mb-6 lg:mb-8 xl:mb-10
                "
              >
                Shop
              </h3>
              <ul className="space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 brand-text-muted text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px]">
                <li><Link href="/shop">All Products</Link></li>
                <li><Link href="/wishlist">Wishlist</Link></li>
                <li><Link href="/orders">Orders</Link></li>
                <li><Link href="/coming-soon">Coming Soon</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3
                className="
                  text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-semibold uppercase tracking-[0.1em]
                  brand-text-primary mb-4 sm:mb-6 lg:mb-8 xl:mb-10
                "
              >
                Support
              </h3>
              <ul className="space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 brand-text-muted text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px]">
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/faq">FAQs</Link></li>
                <li><Link href="/returns">Returns</Link></li>
                <li><Link href="/shipping">Shipping</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW — Compact spacing */}
      <div
        className="
          relative max-w-7xl xl:max-w-screen-2xl 2xl:max-w-screen-xl mx-auto
          flex flex-col lg:flex-row
          justify-center items-center
          mt-12 lg:mt-24 xl:mt-28 pt-6 lg:pt-12 xl:pt-16
          border-t border-white/10
          gap-4 lg:gap-0
        "
      >
        <p className="text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px] brand-text-muted">
          © {new Date().getFullYear()} HUMANTEE
        </p>
      </div>

      {/* Additional line and padding */}
      <div className="border-t border-white/5 mt-8 mb-12"></div>
    </footer>
  );
}
