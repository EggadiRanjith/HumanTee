"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================================  
   HUMANTEE SUPREME TITLE — FINAL VERSION (NO MORE UPGRADES POSSIBLE)
   - Perfect contrast
   - Parallax reveal
   - Light sweep
   - Subpixel glow
   - Zero bugs on dark backgrounds
============================================================================ */

function HumanteeTitle() {
  const letters = "HUMANTEE".split("");

  return (
    <motion.div
      className="
        relative
        inline-flex 
        text-[clamp(1.5rem,8vw,4.5rem)]
        xs:text-[clamp(1.75rem,10vw,4.5rem)]
        sm:text-[clamp(2rem,11vw,4.5rem)]
        uppercase 
        tracking-[clamp(0.04em,0.6vw,0.22em)]
        xs:tracking-[clamp(0.06em,0.8vw,0.22em)]
        sm:tracking-[clamp(0.06em,0.9vw,0.22em)]
        font-bold 
        brand-text-primary
        select-none
        leading-tight
        break-words
        px-2 xs:px-3 sm:px-4
      "
      style={{ fontFamily: "var(--font-tan-pearl)" }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.085,
            delayChildren: 0.22,
          },
        },
      }}
    >

      {letters.map((char, i) => (
        <motion.span
          key={i}
          className="relative inline-block"
          variants={{
            hidden: {
              opacity: 0,
              x: i < 3 ? -45 : i > 4 ? 45 : 0,
              y: 12,
              filter: "blur(18px)",
              scale: 0.92,
            },
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
              scale: 1,
              transition: {
                duration: 0.9,
                ease: [0.23, 1, 0.32, 1],
              },
            },
          }}
        >
          {/* ✦ SUBPIXEL LUMINANCE GLOW */}
          <span
            className="
              absolute inset-0 
              blur-[18px] 
              opacity-[0.28] 
              bg-brand-primary
            "
          />
          {/* MAIN LETTER */}
          <span>{char}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}

const Title = () => <HumanteeTitle />;

/* ============================================================================  
   MAIN LOADER WRAPPER
============================================================================ */

type LoaderVariant = "minimal" | "cinematic" | "ultra";

export default function IntroLoader({
  duration = 3500,
  children,
  onComplete,
  variant = "cinematic",
}: {
  duration?: number;
  children?: React.ReactNode;
  onComplete?: () => void;
  variant?: LoaderVariant;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onComplete]);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden brand-bg-dusk">
      <style jsx global>{`
        body, html {
          overflow: hidden;
          height: 100dvh;
          width: 100vw;
          touch-action: none;
        }
      `}</style>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden cinematic-bg-void"
          >
            {variant === "minimal" && <MinimalLoader />}
            {variant === "cinematic" && <CinematicLoader />}
            {variant === "ultra" && <UltraLoader />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal app after loader */}
      <div
        className={`transition-opacity duration-700 ${
          visible ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================================  
   MINIMAL — Elegant, Soft Glass
============================================================================ */

function MinimalLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full text-center px-2 xs:px-3 sm:px-4 md:px-6">

      <div className="absolute inset-0 cinematic-aurora-animated opacity-40 blur-3xl" />

      <div className="relative luxury-glass px-[clamp(0.75rem,4vw,2.5rem)] xs:px-[clamp(1rem,5vw,2.5rem)] py-[clamp(1.25rem,5vw,2.5rem)] xs:py-[clamp(1.5rem,6vw,2.5rem)] rounded-xl border brand-border-subtle max-w-[92vw] xs:max-w-[95vw] sm:max-w-md w-full">
        <Title />
        <div className="h-px w-[clamp(3rem,18vw,6rem)] xs:w-[clamp(4rem,20vw,6rem)] mt-2 xs:mt-3 sm:mt-4 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent mx-auto" />
        <p className="text-[clamp(0.65rem,3vw,0.875rem)] xs:text-[clamp(0.7rem,3.5vw,0.875rem)] uppercase brand-text-muted tracking-[clamp(0.04em,1vw,0.15em)] xs:tracking-[clamp(0.05em,1.2vw,0.15em)] font-geist mt-2 xs:mt-3">
          crafted experiences
        </p>
      </div>
    </div>
  );
}

/* ============================================================================  
   CINEMATIC — Aurora Field + Premium Title
============================================================================ */

function CinematicLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden cinematic-gradient-aurora px-2 xs:px-3 sm:px-4 md:px-6">

      {/* Aurora animation */}
      <motion.div
        className="absolute inset-0 opacity-35"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: "var(--gradient-aurora)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="flex flex-col items-center gap-3 xs:gap-4 sm:gap-6 text-center max-w-[92vw] xs:max-w-[95vw] sm:max-w-md w-full">
        <span className="text-[clamp(0.65rem,3vw,0.875rem)] xs:text-[clamp(0.7rem,3.5vw,0.875rem)] uppercase tracking-[clamp(0.25em,2vw,0.55em)] xs:tracking-[clamp(0.3em,2.5vw,0.55em)] brand-text-muted">
          Maison Digitale
        </span>

        <Title />

        <p className="text-[clamp(0.65rem,3vw,0.875rem)] xs:text-[clamp(0.7rem,3.5vw,0.875rem)] uppercase brand-text-muted tracking-[clamp(0.04em,1vw,0.15em)] xs:tracking-[clamp(0.05em,1.2vw,0.15em)] mt-1 xs:mt-2">
          crafted experiences
        </p>
      </div>
    </div>
  );
}

/* ============================================================================  
   ULTRA — High Glass + Aurora
============================================================================ */

function UltraLoader() {
  return (
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden cinematic-gradient-aurora px-2 xs:px-3 sm:px-4 md:px-6">

      <motion.div
        className="absolute inset-0 opacity-[0.4]"
        animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }}
        transition={{ duration: 24, repeat: Infinity }}
        style={{
          background: "var(--gradient-aurora)",
          backgroundSize: "220% 220%",
        }}
      />

      <div className="luxury-glass px-[clamp(1rem,5vw,3rem)] xs:px-[clamp(1.5rem,6vw,3rem)] py-[clamp(1.5rem,6vw,2.5rem)] xs:py-[clamp(2rem,7vw,2.5rem)] rounded-2xl border brand-border-strong text-center max-w-[92vw] xs:max-w-[95vw] sm:max-w-md w-full">
        <span className="text-[clamp(0.65rem,3vw,0.875rem)] xs:text-[clamp(0.7rem,3.5vw,0.875rem)] tracking-[clamp(0.25em,2vw,0.6em)] xs:tracking-[clamp(0.3em,2.5vw,0.6em)] brand-text-muted uppercase">
          Maison Digitale
        </span>

        <div className="my-3 xs:my-4">
          <Title />
        </div>

        <span className="text-[clamp(0.65rem,3vw,0.875rem)] xs:text-[clamp(0.7rem,3.5vw,0.875rem)] uppercase brand-text-muted tracking-[clamp(0.04em,1vw,0.2em)] xs:tracking-[clamp(0.05em,1.2vw,0.2em)]">
          crafted experiences
        </span>
      </div>
    </div>
  );
}
