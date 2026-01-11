"use client";

interface AccountHeaderProps {
    fullName?: string;
    email: string;
    showBackButton?: boolean;
}

export default function AccountHeader({ fullName, email, showBackButton = false }: AccountHeaderProps) {
    const getInitials = () => {
        if (!fullName) return email.charAt(0).toUpperCase();
        const names = fullName.split(' ');
        if (names.length >= 2) {
            return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
        }
        return names[0].charAt(0).toUpperCase();
    };

    return (
        <div className="mb-6 sm:mb-8 md:mb-10">
            {showBackButton && (
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Account</span>
                </button>
            )}

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white shadow-lg flex-shrink-0">
                    {getInitials()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-wide truncate">
                        {fullName || 'Welcome'}
                    </h1>
                    <p className="text-white/60 text-sm sm:text-base mt-1 truncate">
                        {email}
                    </p>
                </div>
            </div>
        </div>
    );
}
