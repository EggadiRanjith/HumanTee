/**
 * Auth Status Component
 * Client component to show login/account link based on auth status
 */

"use client";

import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useLoading } from "@/app/contexts/LoadingContext";

interface AuthStatusProps {
    isAuthenticated: boolean;
    customerName?: string;
}

export function AuthStatus({ isAuthenticated, customerName }: AuthStatusProps) {
    const { setLoading } = useLoading();
    const pathname = usePathname();

    const handleNav = (href: string) => {
        if (pathname !== href) setLoading(true);
    };

    if (!isAuthenticated) {
        return (
            <Link
                href="/login"
                prefetch={false}
                onClick={() => handleNav("/login")}
                className="
          transition-all duration-300
          text-white hover:text-white/90
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
            prefetch={false}
            onClick={() => handleNav("/account")}
            className="
        transition-all duration-300
        text-white hover:text-white/90
        hover:scale-110
        hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
        p-1
        relative
      "
            title={customerName ? `Account - ${customerName}` : "Account"}
        >
            <FiUser size={28} />
        </Link>
    );
}

export function AuthStatusMobile({ isAuthenticated, customerName }: AuthStatusProps) {
    const { setLoading } = useLoading();
    const pathname = usePathname();

    const handleNav = (href: string) => {
        if (pathname !== href) setLoading(true);
    };

    if (!isAuthenticated) {
        return (
            <Link href="/login" prefetch={false} onClick={() => handleNav("/login")} className="text-white hover:text-white/90 transition-colors">
                <FiUser size={22} className="text-white" />
            </Link>
        );
    }

    return (
        <Link href="/account" prefetch={false} onClick={() => handleNav("/account")} className="relative text-white hover:text-white/90 transition-colors">
            <FiUser size={22} className="text-white" />
        </Link>
    );
}
