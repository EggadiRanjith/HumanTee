"use client";

import { motion } from "framer-motion";
import NavLink from "./NavLink";
import { FiHeart, FiUser, FiShoppingBag, FiList } from "react-icons/fi";

export default function Navbar({ isCompact = false }: { isCompact?: boolean }) {
  return (
    <nav className="flex items-center gap-3 md:gap-4">
      {/* Text version (XL Desktop Only) */}
      {!isCompact && (
        <motion.div
          className="hidden xl:flex items-center gap-4 2xl:gap-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.3, 1] }}
        >
          <NavLink href="/shop">SHOP</NavLink>
          <NavLink href="/wishlist">WISHLIST</NavLink>
          <NavLink href="/orders">ORDERS</NavLink>
          <NavLink href="/profile">PROFILE</NavLink>
        </motion.div>
      )}

      {/* Icon version (Tablet + Desktop) */}
      <motion.div
        className="hidden md:flex xl:hidden items-center gap-3 lg:gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.3, 1] }}
      >
        <NavLink href="/shop">
          <FiShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-brand-primary" />
        </NavLink>
        <NavLink href="/wishlist">
          <FiHeart className="w-5 h-5 lg:w-6 lg:h-6 text-brand-primary" />
        </NavLink>
        <NavLink href="/orders">
          <FiList className="w-5 h-5 lg:w-6 lg:h-6 text-brand-primary" />
        </NavLink>
        <NavLink href="/profile">
          <FiUser className="w-5 h-5 lg:w-6 lg:h-6 text-brand-primary" />
        </NavLink>
      </motion.div>
    </nav>
  );
}
