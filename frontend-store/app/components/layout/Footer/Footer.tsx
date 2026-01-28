"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import ScrollingText from "../shared/ScrollingText";
import { BrandSection, FooterNav, FooterSkeleton } from "./components";
import { useFooterSettings } from "./hooks/useFooterSettings";
import { FOOTER_NAV_SECTIONS } from "./constants";

function Footer() {
  // Get header-footer settings from centralized cache
  const { settings, isLoading } = useFooterSettings();
  const pathname = usePathname();

  if (pathname?.startsWith('/maintenance')) {
    return null;
  }

  const isDesktop = useMediaQuery('(min-width: 640px)');

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
            filter: "blur(40px)",
          }}
          animate={{ opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* CONTENT GRID */}
        <div className="relative max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {isLoading ? (
            <FooterSkeleton />
          ) : (
            <>
              {/* Brand Column */}
              <BrandSection
                brandName={settings?.brand_name}
                logoUrl={settings?.logo_url}
                tagline={settings?.tagline}
                socialLinks={settings?.social_links}
              />

              {/* Navigation Columns */}
              {FOOTER_NAV_SECTIONS.map((section) => (
                <FooterNav
                  key={section.title}
                  section={section}
                  isDesktop={isDesktop}
                />
              ))}
            </>
          )}
        </div>
      </footer>

      {/* Scrolling Text Section */}
      {isLoading ? (
        <div className="relative w-full bg-brand-bg border-t border-white/10 py-6">
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 w-48 bg-white/10 rounded animate-pulse flex-shrink-0"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <ScrollingText />
      )}

      {/* COPYRIGHT */}
      <div className="relative w-full bg-brand-bg border-t border-white/10">
        <div className="max-w-screen-xl mx-auto py-4 text-center">
          {isLoading ? (
            <div className="h-3 w-48 bg-white/10 rounded animate-pulse mx-auto" />
          ) : (
            <p className="text-white/55 text-[12px] tracking-[0.2em]">
              © {new Date().getFullYear()} {settings?.brand_name}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(Footer);
