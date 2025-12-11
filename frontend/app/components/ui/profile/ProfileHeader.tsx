/**
 * Profile Header Component
 * Displays user avatar, name, and profile information
 */

import Link from 'next/link';
import { FiUser } from 'react-icons/fi';

interface ProfileHeaderProps {
    name: string;
    memberSince: string;
    editHref?: string;
}

export function ProfileHeader({ name, memberSince, editHref = '/profile/personal' }: ProfileHeaderProps) {
    return (
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
                    {name}
                </h2>
                <p className="text-white/50 text-[11px] sm:text-[12px] mt-1">
                    Premium Member · Since {memberSince}
                </p>
            </div>

            {/* Edit Button */}
            <Link
                href={editHref}
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
    );
}
