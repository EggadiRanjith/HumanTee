"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PageTransitionProvider } from "@/app/components/transition/PageTransitionProvider";

/* ------------------------------------------------------------
   Aesthetic 503 Numeral — Cinematic White/Black
------------------------------------------------------------ */
function Big503() {
  const digits = ["5", "0", "3"];

  return (
    <motion.div
      className="
        flex 
        gap-2 xs:gap-3 sm:gap-4 
        text-[clamp(3rem,20vw,8rem)] 
        xs:text-[clamp(4rem,22vw,8rem)]
        sm:text-step-9 
        font-bold 
        text-white/90 
        tracking-[0.10em] xs:tracking-[0.12em] sm:tracking-[0.15em]
        select-none
      "
      style={{ fontFamily: "var(--font-tan-pearl)" }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {digits.map((d, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
              filter: "blur(20px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 1,
                ease: [0.25, 1, 0.3, 1],
              },
            },
          }}
        >
          {d}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------
   Main Page — Cinematic Black & White 503
------------------------------------------------------------ */
export default function ServiceUnavailable() {
  return (
    <PageTransitionProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 1, 0.3, 1] }}
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
        <motion.div
          className="
            absolute w-[60%] h-[160%]
            left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            opacity-[0.14]
            blur-[90px]
            pointer-events-none
            bg-gradient-to-b from-white/16 via-transparent to-white/10
          "
          animate={{ opacity: [0.10, 0.15, 0.10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 xs:px-5 sm:px-6 max-w-3xl w-full">

          {/* BIG 503 */}
          <Big503 />

          {/* Subtitle */}
          <motion.h2
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
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              delay: 0.45,
              ease: [0.25, 1, 0.3, 1],
            }}
          >
            Maintenance Mode
          </motion.h2>

          {/* Cinematic Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.9,
              delay: 1.0,
              ease: [0.25, 1, 0.3, 1],
            }}
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
          <motion.p
            className="
              text-[clamp(0.8125rem,2vw,1rem)]
              xs:text-step-0
              brand-text-muted
              max-w-lg
              leading-relaxed
              mb-8 xs:mb-10 sm:mb-12
              px-2
            "
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.2,
              ease: [0.25, 1, 0.3, 1],
            }}
          >
            We're currently performing system enhancements.  
            The experience will return shortly, better than ever.
          </motion.p>

          {/* Luxury CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.5,
              ease: [0.25, 1, 0.3, 1],
            }}
          >
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
                Check Status
              </span>
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </PageTransitionProvider>
  );
}
