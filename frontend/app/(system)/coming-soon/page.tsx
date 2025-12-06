"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PageTransitionProvider } from "@/app/components/transition/PageTransitionProvider";

/* ------------------------------------------------------------
   Cinematic "COMING SOON" Typographic Block
------------------------------------------------------------ */
function ComingSoonTitle() {
  const words = ["COMING", "SOON"];

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {words.map((word, wi) => (
        <motion.div
          key={wi}
          className="
            inline-flex 
            text-step-7 
            uppercase 
            tracking-[0.20em] 
            font-bold 
            text-white/90
          "
          style={{ fontFamily: "var(--font-tan-pearl)" }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09,
                delayChildren: wi === 0 ? 0.2 : 0.5,
              },
            },
          }}
        >
          {word.split("").map((char, i) => (
            <motion.span
              key={i}
              className="relative inline-block"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 28,
                  filter: "blur(18px)",
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.9,
                    ease: [0.25, 1, 0.3, 1],
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------
   Main Page — Cinematic Coming Soon (Monochrome)
------------------------------------------------------------ */
export default function ComingSoon() {
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
          cinematic-bg-void
        "
      >
        {/* Monochrome Fog Layer */}
        <div className="absolute inset-0 opacity-[0.13] pointer-events-none">
          <div className="absolute inset-0 blur-[180px] bg-white/10" />
        </div>

        {/* Dramatic Center Light Beam */}
        <motion.div
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
          animate={{ opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl">

          {/* Cinematic COMING SOON */}
          <ComingSoonTitle />

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1,
              delay: 1.0,
              ease: [0.25, 1, 0.3, 1],
            }}
            className="
              h-px
              w-40
              my-8
              bg-gradient-to-r
              from-transparent
              via-white/45
              to-transparent
              origin-center
            "
          />

          {/* Description */}
          <motion.p
            className="
              text-step-0
              brand-text-muted
              max-w-lg
              leading-relaxed
              mb-12
            "
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.3,
              ease: [0.25, 1, 0.3, 1],
            }}
          >
            A new chapter of digital luxury is being crafted — with precision, elegance, and vision.
          </motion.p>

          {/* CTA — Luxury Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.6,
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
                px-12
                py-4
                rounded-xl
                text-step-0
                tracking-[0.12em]
                uppercase
                font-geist
                text-white/90

                border border-white/15
                luxury-glass
                shadow-floating
                backdrop-blur-xl
                overflow-hidden

                transition-all
                duration-[700ms]
                ease-[cubic-bezier(0.25,1,0.3,1)]
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
          </motion.div>

        </div>
      </motion.div>
    </PageTransitionProvider>
  );
}
