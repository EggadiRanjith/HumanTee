/**
 * SectionHeader Component
 * Reusable section header with title and optional action button
 * Static luxury typography (no stagger animation)
 */

import Link from 'next/link';

interface SectionHeaderProps {
    title: string;
    actionText?: string;
    actionHref?: string;
    variant?: 'default' | 'centered';
    className?: string;
}

export default function SectionHeader({
    title,
    actionText,
    actionHref,
    variant = 'default',
    className = ''
}: SectionHeaderProps) {
    if (variant === 'centered') {
        return (
            <div className={`text-center mb-12 ${className}`}>
                <h2 className="font-geist font-semibold text-[26px] sm:text-[32px] md:text-[36px] text-white tracking-wide">
                    {title}
                </h2>
                <div className="w-24 h-[2px] bg-white/25 mx-auto mt-4 rounded-full" />
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-between mb-7 sm:mb-10 ${className}`}>
            <h2 className="text-[18px] sm:text-[28px] md:text-[34px] font-light tracking-wide text-white">
                {title}
            </h2>

            {actionText && actionHref && (
                <Link
                    href={actionHref}
                    className="
            text-white/70 text-[10px] sm:text-[12px]
            uppercase tracking-[0.22em]
            border border-white/15 rounded-full
            px-3 py-1.5 sm:px-4 sm:py-2
            hover:text-white hover:border-white/30
            transition-all luxury-glass
          "
                >
                    {actionText}
                </Link>
            )}
        </div>
    );
}
