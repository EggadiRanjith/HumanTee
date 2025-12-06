"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        relative
        min-w-[44px] min-h-[44px]
        md:min-w-[48px] md:min-h-[48px]
        flex items-center justify-center
        touch-target
      "
    >
      <motion.span
        className={`
          relative
          inline-flex
          items-center
          justify-center
          gap-1.5
          md:gap-2
          py-2
          px-2.5
          md:px-3
          text-xs
          md:text-sm
          font-geist
          uppercase
          tracking-[0.10em]
          md:tracking-[0.12em]
          transition-colors
          duration-200
          ${isActive ? "brand-text-primary" : "brand-text-muted hover:brand-text-primary"}
        `}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.3, 1] }}
      >
        {children}

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-px w-full bg-brand-primary/60 origin-center"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.3, 1] }}
        />
      </motion.span>
    </Link>
  );
}
