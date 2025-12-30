"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import comingSoonAnimation from "@/public/animation/lottie/system-animation/comingsoon.json";

// Dynamic import to prevent SSR issues with lottie-react
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/* ------------------------------------------------------------
   Lottie Coming Soon Animation
------------------------------------------------------------ */
function BigComingSoon() {
  return (
    <Lottie
      animationData={comingSoonAnimation}
      loop={true}
      className="w-full h-auto max-w-2xl mx-auto"
    />
  );
}

/* ------------------------------------------------------------
   Main Page
------------------------------------------------------------ */
export default function ComingSoon() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNotifyMe = () => {
    setIsSubscribed(true);
    // In a real app, this would call a newsletter signup API
  };

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
        <BigComingSoon />

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
          {isSubscribed
            ? "Thank you for joining us. We will reach out as soon as the collection unveils."
            : "A new chapter of digital luxury is being crafted — with precision, elegance, and vision."}
        </p>

        {/* CTA — Luxury Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isSubscribed && (
            <button
              onClick={handleNotifyMe}
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
              Notify Me
            </button>
          )}

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
