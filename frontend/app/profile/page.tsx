"use client";

import { FiMapPin, FiLogOut, FiChevronRight, FiUser } from "react-icons/fi";
import Link from "next/link";
import { ProfileHeader } from "@/app/components/ui/profile";
import { GradientOverlay } from "@/app/components/ui/layout";

export default function ProfilePage() {
  const menuItems = [
    { icon: FiUser, label: "Personal Information", href: "/profile/personal" },
    { icon: FiMapPin, label: "Shipping Addresses", href: "/profile/addresses" },
  ];

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />

      <div className="relative max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pt-12">

        {/* Page Title */}
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

        {/* User Card */}
        <ProfileHeader name="John Doe" memberSince="2024" />

        {/* Menu List */}
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

        {/* Logout */}
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
