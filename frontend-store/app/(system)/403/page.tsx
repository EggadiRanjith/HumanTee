"use client";

import Link from 'next/link';
import { useEffect } from "react";

/**
 * 403 Forbidden Page
 * System page for unauthorized access
 */
export default function ForbiddenPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className="
        relative
        min-h-screen
        flex
        items-center
        justify-center
        overflow-hidden
        cinematic-bg-void
      "
        >
            {/* Soft atmospheric fog */}
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none">
                <div className="absolute inset-0 blur-[160px] bg-white/10" />
            </div>

            {/* Vertical cinematic light beam */}
            <div
                className="
            absolute w-[60%] h-[160%]
            left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            opacity-[0.12]
            blur-[80px]
            pointer-events-none
            bg-gradient-to-b from-white/15 via-transparent to-white/10
          "
            />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center text-center px-4 xs:px-5 sm:px-6 max-w-3xl w-full">

                <h1 className="text-6xl font-bold text-white mb-4 tracking-widest">403</h1>

                {/* Subtitle */}
                <h2
                    className="
              text-[clamp(1.125rem,4vw,1.953rem)]
              xs:text-step-3
              uppercase
              tracking-[0.12em] xs:tracking-[0.15em] sm:tracking-[0.18em]
              brand-text-primary
              mt-6 xs:mt-8 sm:mt-10
              px-2
              font-geist
            "
                >
                    Access Forbidden
                </h2>

                {/* Cinematic Line */}
                <div
                    className="
              h-px
              w-24 xs:w-32 sm:w-40
              my-4 xs:my-5 sm:my-6
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
              origin-center
            "
                />

                {/* Description */}
                <p
                    className="
              text-[clamp(0.8125rem,2vw,1rem)]
              xs:text-step-0
              brand-text-muted
              max-w-lg
              leading-relaxed
              mb-8 xs:mb-10 sm:mb-12
              px-2
            "
                >
                    You don't have permission to access this area. Restricted to administrative personnel.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="
                group
                relative
                inline-flex
                items-center
                justify-center
                px-8
                py-3.5
                rounded-xl
                text-[13px]
                tracking-[0.12em]
                uppercase
                font-geist
                text-white/90
                border border-white/15
                luxury-glass
                transition-all
                duration-500
                hover:bg-white/10
              "
                    >
                        Return Home
                    </Link>

                    <Link
                        href="/login"
                        className="
                group
                relative
                inline-flex
                items-center
                justify-center
                px-8
                py-3.5
                rounded-xl
                text-[13px]
                tracking-[0.12em]
                uppercase
                font-geist
                text-white/70
                border border-white/5
                bg-white/5
                transition-all
                duration-500
                hover:text-white
                hover:border-white/20
              "
                    >
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
}
