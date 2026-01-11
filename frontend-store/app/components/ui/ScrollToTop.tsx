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

        // Store timeout IDs for cleanup
        const timeoutIds: NodeJS.Timeout[] = [];
        timeoutIds.push(setTimeout(scrollToTop, 10) as unknown as NodeJS.Timeout);
        timeoutIds.push(setTimeout(scrollToTop, 50) as unknown as NodeJS.Timeout);
        timeoutIds.push(setTimeout(scrollToTop, 100) as unknown as NodeJS.Timeout);

        // Clean up: clear all timeouts on unmount
        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    }, [pathname]);

    return null;
}
