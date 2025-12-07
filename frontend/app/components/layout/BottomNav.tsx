"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiShoppingBag, FiHome, FiList } from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";

const navItems = [
  { href: "/", icon: FiHome, label: "Home" },
  { href: "/shop", icon: FiShoppingBag, label: "Shop" },
  { href: "/orders", icon: FiList, label: "Orders" },
  { href: "/profile", icon: FiUser, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isLoading } = useLoading();

  // Hide bottom nav during intro loading
  if (isLoading) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.3, 1] }}
      className="
        fixed
        bottom-0
        left-0
        right-0
        md:hidden
        z-[6000]
        safe-area-bottom
      "
    >
      {/* Glass container */}
      <div
        className="
          relative
          mx-3 mb-3
          luxury-glass
          border border-white/12
          rounded-2xl
          backdrop-blur-2xl
          shadow-[0_0_40px_-10px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 20px rgba(255,255,255,0.05)" }}
        />

        {/* Navigation items */}
        <div className="relative flex items-center justify-around px-2 py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  relative
                  flex flex-col
                  items-center
                  justify-center
                  gap-1
                  px-3 py-2
                  rounded-xl
                  min-w-[60px]
                  touch-target
                  transition-all
                  duration-200
                  group
                "
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <Icon
                    size={22}
                    className={`
                      transition-colors duration-200
                      ${isActive ? "text-brand-primary" : "text-brand-text-muted group-hover:text-brand-primary"}
                    `}
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`
                    text-[10px] xs:text-[11px]
                    font-geist
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    transition-colors duration-200
                    relative z-10
                    ${isActive ? "text-brand-primary" : "text-brand-text-dim group-hover:text-brand-text-muted"}
                  `}
                >
                  {item.label}
                </span>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ opacity: 1 }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

