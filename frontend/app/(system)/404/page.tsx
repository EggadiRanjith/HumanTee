"use client";

import Link from "next/link";
import { useEffect } from "react";
import Lottie from "lottie-react";
import error404Animation from "@/public/animation/lottie/system-animation/Error404.json";

/* ------------------------------------------------------------
   Lottie 404 Animation
------------------------------------------------------------ */
function Big404() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Lottie
        animationData={error404Animation}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}

/* ------------------------------------------------------------
   Main Page
------------------------------------------------------------ */
export default function NotFound() {
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
        cinematic-bg-oblivion
      "
    >
      {/* Soft white atmospheric fog */}
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

        {/* BIG CINEMATIC 404 */}
        <Big404 />

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
            "
          style={{ fontFamily: "var(--font-tan-pearl)" }}
        >
          Lost in the Void
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
          The page you're looking for no longer exists — or drifted somewhere unreachable.
        </p>

        {/* CTA */}
        <div>
          <Link
            href="/"
            className="
    group
    relative
    inline-flex
    items-center
    justify-center
    px-6 xs:px-8 sm:px-10 md:px-12
    py-3 xs:py-3.5 sm:py-4
    rounded-xl
    text-[13px] xs:text-step-0
    tracking-[0.10em] xs:tracking-[0.12em]
    uppercase
    font-geist
    text-white/90
    min-h-[44px] xs:min-h-[48px]
    border border-white/15
    luxury-glass
    shadow-floating
    transition-all
    duration-[700ms]
    ease-[cubic-bezier(0.25,1,0.3,1)]
    overflow-hidden
    backdrop-blur-xl
    touch-target
  "
          >
            {/* Subtle Inner Glow */}
            <span className="
    absolute inset-0 
    rounded-xl 
    bg-white/5
    opacity-0
    group-hover:opacity-10
    transition-opacity
    duration-700
  " />

            {/* Aurora Line Sweep */}
            <span
              className="
      pointer-events-none
      absolute
      top-0 left-0
      h-full w-[90px]
      bg-gradient-to-r
      from-transparent
      via-white/40
      to-transparent
      opacity-0
      group-hover:opacity-70
      blur-[22px]
      translate-x-[-120%]
      group-hover:translate-x-[180%]

      transition-all
      duration-[1200ms]
      ease-[cubic-bezier(0.25,1,0.3,1)]
    "
            />

            {/* Button Text */}
            <span className="relative z-10 tracking-wider font-medium">
              Return Home
            </span>

          </Link>

        </div>

      </div>
    </div>
  );
}
