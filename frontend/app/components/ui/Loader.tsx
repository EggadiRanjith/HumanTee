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
        text-step-6 
        uppercase 
        tracking-[0.18em] 
        font-bold 
        brand-text-primary
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
            staggerChildren: 0.085,
            delayChildren: 0.22,
          },
        },
      }}
    >
      {/* ✦ GLOBAL VOLUMETRIC LIGHT SWEEP */}
      <motion.div
        className="
          absolute inset-0 
          bg-gradient-to-r 
          from-transparent 
          via-white/25 
          to-transparent 
          blur-[36px] 
          mix-blend-screen
          pointer-events-none
        "
        animate={{ x: ["-35%", "140%"] }}
        transition={{
          duration: 2.8,
          ease: [0.23, 1, 0.32, 1],
        }}
      />

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

export default function Loader({
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
    <div className="relative min-h-[100svh] brand-bg-dusk">
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
    <div className="relative flex flex-col items-center justify-center h-full w-full text-center">

      <div className="absolute inset-0 cinematic-aurora-animated opacity-40 blur-3xl" />

      <div className="relative luxury-glass px-10 py-10 rounded-xl shadow-floating border brand-border-subtle">
        <Title />
        <div className="h-px w-24 mt-4 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
        <p className="text-step--1 uppercase brand-text-muted tracking-wide font-geist">
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
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden cinematic-gradient-aurora">

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

      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-step--1 uppercase tracking-[0.55em] brand-text-muted">
          Maison Digitale
        </span>

        <Title />

        <p className="text-step--1 uppercase brand-text-muted tracking-wide">
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
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden cinematic-gradient-aurora">

      <motion.div
        className="absolute inset-0 opacity-[0.4]"
        animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }}
        transition={{ duration: 24, repeat: Infinity }}
        style={{
          background: "var(--gradient-aurora)",
          backgroundSize: "220% 220%",
        }}
      />

      <div className="luxury-glass px-12 py-10 rounded-2xl shadow-floating border brand-border-strong text-center">
        <span className="text-step--1 tracking-[0.6em] brand-text-muted uppercase">
          Maison Digitale
        </span>

        <Title />

        <span className="text-step--1 uppercase brand-text-muted tracking-wider">
          crafted experiences
        </span>
      </div>
    </div>
  );
}
