"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiInstagram, FiTwitter, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      className="
        relative w-full
        pt-16 pb-12
        px-6 sm:px-10
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

      {/* MAIN GRID → Compact, clean, luxury */}
      <div
        className="
          relative max-w-screen-xl mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-10
        "
      >
        {/* BRAND COLUMN – Small, elegant */}
        <div className="flex flex-col gap-3">
          <h2
            className="
              text-[14px] font-semibold
              tracking-[0.12em] uppercase
              brand-text-primary
            "
          >
            Humantee
          </h2>

          <p className="brand-text-muted text-xs leading-relaxed max-w-xs">
            A luxury shopping experience crafted with cinematic precision.
          </p>

          {/* Small icon set */}
          <div className="flex items-center gap-3 mt-3">
            {[FiInstagram, FiTwitter, FiGithub].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className="
                  w-9 h-9 flex items-center justify-center
                  rounded-full luxury-glass border border-white/10
                  hover:border-brand-primary/40
                  transition-all duration-300
                "
              >
                <Icon className="text-brand-primary" size={15} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* SHOP + SUPPORT (MOBILE = side by side) */}
        <div
          className="
            grid grid-cols-2
            gap-10 sm:gap-6
            lg:grid-cols-1
          "
        >
          {/* SHOP */}
          <div>
            <h3
              className="
                text-[13px] font-semibold uppercase tracking-[0.1em]
                brand-text-primary mb-3
              "
            >
              Shop
            </h3>
            <ul className="space-y-2 brand-text-muted text-xs">
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
                text-[13px] font-semibold uppercase tracking-[0.1em]
                brand-text-primary mb-3
              "
            >
              Support
            </h3>
            <ul className="space-y-2 brand-text-muted text-xs">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
            </ul>
          </div>
        </div>

        {/* NEWSLETTER – compact, no giant elements */}
        <div className="lg:col-span-1 flex flex-col">
          <h3
            className="
              text-[13px] font-semibold uppercase tracking-[0.1em]
              brand-text-primary mb-3
            "
          >
            Newsletter
          </h3>

          <p className="brand-text-muted text-xs mb-4 max-w-xs">
            Get updates and exclusive drops.
          </p>

          <div
            className="
              flex items-center gap-2
              p-2
              rounded-full luxury-glass border border-white/10
            "
          >
            <input
              type="email"
              placeholder="Email"
              className="
                flex-1 bg-transparent outline-none
                text-xs brand-text-primary
                placeholder:brand-text-muted
                px-2
              "
            />
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-4 py-1.5 rounded-full
                bg-brand-primary/10 border border-brand-primary/30
                text-[10px] uppercase tracking-[0.14em]
                brand-text-primary
              "
            >
              Join
            </motion.button>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW — very compact */}
      <div
        className="
          relative max-w-screen-xl mx-auto
          flex flex-col sm:flex-row
          justify-between items-center
          mt-12 pt-6
          border-t border-white/10
        "
      >
        <p className="text-[10px] brand-text-muted">
          © {new Date().getFullYear()} HUMANTEE
        </p>

        <div className="flex gap-4 mt-3 sm:mt-0">
          <Link className="text-[10px] brand-text-muted" href="/privacy">Privacy</Link>
          <Link className="text-[10px] brand-text-muted" href="/terms">Terms</Link>
          <Link className="text-[10px] brand-text-muted" href="/returns">Returns</Link>
        </div>
      </div>
    </footer>
  );
}
