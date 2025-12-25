'use client';

import { usePathname } from 'next/navigation';

export default function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Remove padding for maintenance page to allow full-screen layout
    if (pathname?.startsWith('/maintenance')) {
        return <>{children}</>;
    }

    return (
        <div className="pb-20 md:pb-32">
            {children}
        </div>
    );
}
