"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Aggressive scroll to top to override Next.js scroll restoration
        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Scroll immediately
        scrollToTop();

        // Keep forcing scroll during initial render
        const timeouts = [
            setTimeout(scrollToTop, 0),
            setTimeout(scrollToTop, 10),
            setTimeout(scrollToTop, 50),
            setTimeout(scrollToTop, 100),
        ];

        return () => {
            timeouts.forEach(clearTimeout);
        };
    }, [pathname]);

    return null;
}
