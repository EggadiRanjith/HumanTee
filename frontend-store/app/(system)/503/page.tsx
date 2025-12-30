"use client";

import Link from "next/link";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import error503Animation from "@/public/animation/lottie/system-animation/503.json";

// Dynamic import to prevent SSR issues with lottie-react
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/* ------------------------------------------------------------
   Lottie 503 Animation
------------------------------------------------------------ */
function Big503() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Lottie
        animationData={error503Animation}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}

/* ------------------------------------------------------------
   Main Page — Cinematic Black & White 503
------------------------------------------------------------ */
export default function ServiceUnavailable() {
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
        cinematic-bg-dusk
      "
    >
      {/* Soft monochrome fog */}
      <div className="absolute inset-0 opacity-[0.11] pointer-events-none">
        <div className="absolute inset-0 blur-[170px] bg-white/10" />
      </div>

      {/* Gentle vertical repair-mode light beam */}
      <div
        className="
            absolute w-[60%] h-[160%]
            left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            opacity-[0.14]
            blur-[90px]
            pointer-events-none
            bg-gradient-to-b from-white/16 via-transparent to-white/10
          "
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 xs:px-5 sm:px-6 max-w-3xl w-full">

        {/* BIG 503 */}
        <Big503 />

        {/* Subtitle */}
        <h2
          className="
              text-[clamp(1.125rem,4vw,1.953rem)]
              xs:text-step-3
              uppercase
              tracking-[0.12em] xs:tracking-[0.15em] sm:tracking-[0.18em]
              text-white/90
              mt-6 xs:mt-8 sm:mt-10
              font-geist
              px-2
            "
        >
          Maintenance Mode
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
          We're currently performing system enhancements.
          The experience will return shortly, better than ever.
        </p>

        {/* Luxury CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="
                group
                relative
                inline-flex
                items-center
                justify-center
                px-10
                py-4
                rounded-xl
                text-[13px]
                tracking-[0.12em]
                uppercase
                font-geist
                text-white/90
                border border-white/20
                luxury-glass
                transition-all
                duration-500
                hover:bg-white/10
              "
          >
            Retry Connection
          </button>

          <Link
            href="/"
            className="
                group
                relative
                inline-flex
                items-center
                justify-center
                px-10
                py-4
                rounded-xl
                text-[13px]
                tracking-[0.12em]
                uppercase
                font-geist
                text-white/60
                border border-white/5
                bg-white/5
                transition-all
                duration-500
                hover:text-white
                hover:border-white/20
              "
          >
            Return Home
          </Link>
        </div>

      </div>
    </div>
  );
}
