"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AccountCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
    comingSoon?: boolean;
    isLogout?: boolean;
}

export default function AccountCard({
    icon,
    title,
    description,
    href,
    onClick,
    comingSoon = false,
    isLogout = false,
}: AccountCardProps) {
    const content = (
        <motion.div
            whileHover={!comingSoon ? { scale: 1.02, borderColor: isLogout ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.3)" } : {}}
            whileTap={!comingSoon ? { scale: 0.98 } : {}}
            className={`
                p-5 sm:p-6 rounded-xl luxury-glass transition-all duration-300 group relative overflow-hidden
                ${comingSoon ? 'opacity-50 cursor-not-allowed border border-white/10' :
                    isLogout ? 'border border-red-500/20 hover:border-red-500/40 cursor-pointer' :
                        'border border-white/10 hover:border-white/20 cursor-pointer'}
            `}
        >
            {/* Background gradient on hover */}
            {!comingSoon && (
                <div className={`absolute inset-0 bg-gradient-to-br ${isLogout ? 'from-red-500/10' : 'from-white/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            )}

            <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center
                    border flex-shrink-0 transition-all duration-300
                    ${isLogout
                        ? 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500/20 group-hover:border-red-500/30'
                        : 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-white/20'}
                `}>
                    <div className={`text-2xl sm:text-3xl ${isLogout ? 'text-red-400' : ''}`}>
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-base sm:text-lg font-medium ${isLogout ? 'text-red-400' : 'text-white'}`}>
                            {title}
                        </h3>
                        {comingSoon && (
                            <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-white/10 text-white/60 rounded-full">
                                Coming Soon
                            </span>
                        )}
                    </div>
                    <p className={`text-xs sm:text-sm ${isLogout ? 'text-red-400/70' : 'text-white/60'}`}>
                        {description}
                    </p>
                </div>

                {/* Arrow */}
                {!comingSoon && (
                    <div className={`group-hover:translate-x-1 transition-all duration-300 ${isLogout ? 'text-red-400/60 group-hover:text-red-400' : 'text-white/40 group-hover:text-white/60'}`}>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}
            </div>
        </motion.div>
    );

    if (comingSoon) {
        return content;
    }

    if (onClick) {
        return (
            <button onClick={onClick} className="w-full text-left">
                {content}
            </button>
        );
    }

    if (href) {
        return (
            <Link href={href}>
                {content}
            </Link>
        );
    }

    return content;
}
