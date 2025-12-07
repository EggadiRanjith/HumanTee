"use client";

import { motion } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const menuItems = [
    { icon: FiUser, label: "Personal Information", href: "/profile/personal" },
    { icon: FiMapPin, label: "Shipping Addresses", href: "/profile/addresses" },
    { icon: FiCreditCard, label: "Payment Methods", href: "/profile/payment" },
    { icon: FiSettings, label: "Preferences", href: "/profile/settings" },
  ];

  return (
    <div className="min-h-screen brand-bg pb-24">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-32">

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <h1 className="text-[30px] sm:text-[38px] md:text-[46px] font-light tracking-wide text-white">
            Profile
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage account, addresses & preferences
          </p>
        </motion.div>

        {/* USER CARD — minimal + luxurious */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="
            p-5 sm:p-6
            rounded-2xl luxury-glass border border-white/10
            bg-white/5 backdrop-blur-2xl
            flex items-center gap-4
            mb-10
          "
        >
          {/* AVATAR */}
          <div className="
            w-16 h-16 sm:w-20 sm:h-20 rounded-full luxury-glass
            border border-white/10
            flex items-center justify-center
            bg-gradient-to-br from-brand-primary/40 to-brand-secondary/40
          ">
            <FiUser className="w-7 h-7 text-white" />
          </div>

          {/* NAME */}
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl text-white font-light">
              John Doe
            </h2>
            <p className="text-white/50 text-xs sm:text-sm">
              Premium Member · Since 2024
            </p>
          </div>

          {/* EDIT */}
          <Link
            href="/profile/personal"
            className="
              px-4 py-2 text-xs uppercase tracking-[0.18em]
              rounded-xl luxury-glass border border-white/10
              text-white/70 hover:text-white hover:bg-white/10
              transition-all
            "
          >
            Edit
          </Link>
        </motion.div>

        {/* MENU LIST */}
        <div className="space-y-3">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Link
                  href={item.href}
                  className="
                    flex items-center justify-between
                    p-4 rounded-xl
                    luxury-glass border border-white/10 
                    bg-white/4 backdrop-blur-xl
                    hover:bg-white/10 transition-all
                  "
                >
                  <div className="flex items-center gap-3">
                    <span className="
                      p-2 rounded-lg luxury-glass border border-white/10
                      bg-white/5
                    ">
                      <Icon className="w-5 h-5 text-brand-primary" />
                    </span>

                    <span className="flex flex-col">
                      <span className="text-white text-sm font-medium">
                        {item.label}
                      </span>
                    </span>
                  </div>

                  <FiChevronRight className="text-white/40 group-hover:text-white transition-all" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* LOGOUT */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-10"
        >
          <button className="
            w-full px-6 py-3 rounded-xl
            luxury-glass border border-red-500/20 
            bg-red-500/8 backdrop-blur-xl
            text-red-400 text-sm uppercase tracking-[0.22em]
            hover:bg-red-500/12 transition-all
          ">
            <FiLogOut className="inline-block w-4 h-4 mr-2" />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
