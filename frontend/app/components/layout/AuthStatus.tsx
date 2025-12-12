/**
 * Auth Status Component
 * Client component to show login/account link based on auth status
 */

"use client";

import Link from "next/link";
import { FiUser } from "react-icons/fi";

interface AuthStatusProps {
    isAuthenticated: boolean;
    customerName?: string;
}

export default function AuthStatus({ isAuthenticated, customerName }: AuthStatusProps) {
    if (!isAuthenticated) {
        return (
            <Link
                href="/login"
                className="
          transition-all duration-300
          text-white/70 hover:text-white
          hover:scale-110
          hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
          p-1
        "
                title="Login"
            >
                <FiUser size={28} />
            </Link>
        );
    }

    return (
        <Link
            href="/account"
            className="
        transition-all duration-300
        text-white/70 hover:text-white
        hover:scale-110
        hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
        p-1
        relative
      "
            title={customerName ? `Account - ${customerName}` : "Account"}
        >
            <FiUser size={28} />
            {/* Logged in indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#060010]" />
        </Link>
    );
}

export function AuthStatusMobile({ isAuthenticated, customerName }: AuthStatusProps) {
    if (!isAuthenticated) {
        return (
            <Link href="/login">
                <FiUser size={22} className="text-white/90" />
            </Link>
        );
    }

    return (
        <Link href="/account" className="relative">
            <FiUser size={22} className="text-white/90" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-[#060010]" />
        </Link>
    );
}
