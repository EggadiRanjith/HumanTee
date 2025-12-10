"use client";

import { FiUser, FiMapPin, FiLogOut, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const menuItems = [
    { icon: FiUser, label: "Personal Information", href: "/profile/personal" },
    { icon: FiMapPin, label: "Shipping Addresses", href: "/profile/addresses" },
  ];

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pt-12">

        {/* PAGE TITLE */}
        <div className="mb-12">
          <h1
            className="
              text-[22px] sm:text-[28px] md:text-[34px]
              font-light uppercase
              tracking-[0.16em] text-white
              leading-tight
            "
          >
            Profile
          </h1>

          <p
            className="
              text-white/45 text-[10px] sm:text-[11px]
              uppercase tracking-[0.22em] mt-2
            "
          >
            Manage account & addresses
          </p>
        </div>

        {/* USER CARD */}
        <div
          className="
            p-5 sm:p-6 rounded-2xl luxury-glass
            border border-white/10 bg-white/5 backdrop-blur-xl
            flex items-center gap-5 mb-12
          "
        >
          {/* Avatar */}
          <div
            className="
              w-16 h-16 sm:w-20 sm:h-20 rounded-full luxury-glass
              border border-white/10
              bg-gradient-to-br from-brand-primary/40 to-brand-secondary/40
              flex items-center justify-center
            "
          >
            <FiUser className="w-7 h-7 text-white" />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-white text-[16px] sm:text-[18px] font-light">
              John Doe
            </h2>
            <p className="text-white/50 text-[11px] sm:text-[12px] mt-1">
              Premium Member · Since 2024
            </p>
          </div>

          {/* Edit */}
          <Link
            href="/profile/personal"
            className="
              hidden sm:block px-5 py-2 text-[10px]
              uppercase tracking-[0.22em]
              rounded-xl luxury-glass border border-white/10
              text-white/70 hover:text-white hover:bg-white/10
              transition-colors
            "
          >
            Edit
          </Link>
        </div>

        {/* MENU LIST */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  flex items-center justify-between
                  p-4 rounded-xl luxury-glass
                  border border-white/10 bg-white/5 backdrop-blur-xl
                  hover:bg-white/10 transition-colors
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      p-2 rounded-lg luxury-glass border border-white/10
                      bg-white/5
                    "
                  >
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>

                  <span className="text-white text-sm font-light tracking-wide">
                    {item.label}
                  </span>
                </div>

                <FiChevronRight className="text-white/40" />
              </Link>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="mt-12">
          <button
            className="
              w-full px-6 py-3 rounded-xl luxury-glass
              border border-red-500/20 bg-red-500/10 backdrop-blur-xl
              text-red-400 text-[11px] uppercase tracking-[0.22em]
              hover:bg-red-500/15 transition-colors
            "
          >
            <FiLogOut className="inline-block w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
