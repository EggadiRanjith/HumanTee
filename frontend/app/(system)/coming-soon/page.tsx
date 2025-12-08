"use client";

import Link from "next/link";
import { useEffect } from "react";

/* ------------------------------------------------------------
   Cinematic "COMING SOON" Typographic Block
------------------------------------------------------------ */
function ComingSoonTitle() {
  const words = ["COMING", "SOON"];

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {words.map((word, wi) => (
        <div
          key={wi}
          className="
            inline-flex 
            text-[clamp(2rem,12vw,4.768rem)]
            xs:text-[clamp(2.5rem,13vw,4.768rem)]
            sm:text-step-7 
            uppercase 
            tracking-[0.12em] xs:tracking-[0.16em] sm:tracking-[0.20em] 
            font-bold 
            text-white/90
            px-1 xs:px-2
          "
          style={{ fontFamily: "var(--font-tan-pearl)" }}
        >
          {word.split("").map((char, i) => (
            <span
              key={i}
              className="relative inline-block"
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------
   Main Page — Cinematic Coming Soon (Monochrome)
------------------------------------------------------------ */
export default function ComingSoon() {
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
        {/* Monochrome Fog Layer */}
        <div className="absolute inset-0 opacity-[0.13] pointer-events-none">
          <div className="absolute inset-0 blur-[180px] bg-white/10" />
        </div>

        {/* Dramatic Center Light Beam */}
        <div
          className="
            absolute h-[200%] w-[50%]
            left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            opacity-[0.16]
            blur-[120px]
            bg-gradient-to-b
            from-white/20
            via-transparent
            to-white/10
            pointer-events-none
          "
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 xs:px-5 sm:px-6 max-w-3xl w-full">

          {/* Cinematic COMING SOON */}
          <ComingSoonTitle />

          {/* Underline */}
          <div
            className="
              h-px
              w-24 xs:w-32 sm:w-40
              my-6 xs:my-7 sm:my-8
              bg-gradient-to-r
              from-transparent
              via-white/45
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
            A new chapter of digital luxury is being crafted — with precision, elegance, and vision.
          </p>

          {/* CTA — Luxury Button */}
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
                backdrop-blur-xl
                overflow-hidden
                transition-all
                duration-[700ms]
                ease-[cubic-bezier(0.25,1,0.3,1)]
                touch-target
              "
            >
              <span className="
                absolute inset-0 
                rounded-xl 
                bg-white/5
                opacity-0
                group-hover:opacity-10
                transition-opacity
                duration-700
              " />

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

              <span className="relative z-10 tracking-wider font-medium">
                Notify Me
              </span>
            </Link>
          </div>

        </div>
      </div>
  );
}
