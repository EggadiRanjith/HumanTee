"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import localFont from "next/font/local";

const tanPearl = localFont({
  src: [
    {
      path: "../../../public/fonts/tan-pearl/TAN-PEARL.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-tan-pearl",
});

type LoaderVariant = "minimal" | "cinematic" | "ultra";

interface LoaderProps {
  duration?: number;
  children?: ReactNode;
  onComplete?: () => void;
  variant?: LoaderVariant;
}

export default function Loader({
  duration = 3500,
  children,
  onComplete,
  variant = "cinematic",
}: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className={`${tanPearl.variable} relative min-h-[100svh] bg-brand-bg`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={`loader-${variant}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-0 z-[999] flex h-full w-full items-center justify-center overflow-hidden bg-brand-bg"
          >
            {variant === "minimal" && <MinimalLoaderVisual />}
            {variant === "cinematic" && <CinematicLoaderVisual />}
            {variant === "ultra" && <UltraLuxuryLoaderVisual />}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`transition-opacity duration-700 ${
          isVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function MinimalLoaderVisual() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-8 sm:px-8 sm:py-12 text-center text-white">
      <div className="absolute inset-0 bg-brand-aurora opacity-60 blur-3xl" />
      <div className="relative rounded-xl border border-brand-border-subtle bg-brand-surface/70 px-8 py-8 pt-20 sm:px-12 sm:py-12 sm:pt-24 shadow-ambient-soft backdrop-blur-xl">
        <p className="text-step-1 font-heading tracking-wide uppercase text-brand-text leading-loose" style={{ fontFamily: 'var(--font-tan-pearl)' }}>
          Humantee
        </p>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent sm:w-32" />
        <p className="text-step--1 tracking-normal text-brand-text-muted leading-relaxed" style={{ fontFamily: 'var(--font-tan-pearl)' }}>
          crafted experiences
        </p>
      </div>
    </div>
  );
}

function CinematicLoaderVisual() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#050505] via-[#0c0f25] via-[#221135] to-[#050505] px-8 py-6 text-center text-white sm:px-12 sm:py-8">
      <motion.div
        className="absolute inset-0 opacity-35"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(255,255,255,0.35), transparent 50%), radial-gradient(circle at bottom, rgba(255,255,255,0.12), transparent 45%)",
          backgroundSize: "200% 200%",
        }}
      />
      <motion.div
        className="absolute -top-12 -left-16 h-48 w-48 rounded-full bg-fuchsia-500/25 blur-[80px] sm:-top-16 sm:-left-20 sm:h-72 sm:w-72 sm:blur-[120px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-cyan-400/20 blur-[80px] sm:-bottom-24 sm:-right-16 sm:h-80 sm:w-80 sm:blur-[120px]"
        animate={{ scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6 pt-12 text-center sm:gap-8 sm:px-8 sm:pt-16">
        <motion.span
          className="text-[0.5rem] uppercase tracking-[0.6em] text-white/70 sm:text-[0.6rem] sm:tracking-[0.7em]"
          style={{ fontFamily: 'var(--font-tan-pearl)' }}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          Maison Digitale
        </motion.span>

        <motion.h1
          className="text-3xl font-hero tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 sm:text-4xl md:text-5xl lg:text-6xl leading-loose"
          style={{ fontFamily: 'var(--font-tan-pearl)' }}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1.6,
            delay: 0.55,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          HUMANTEE
        </motion.h1>

        <motion.div
          className="h-px w-32 bg-gradient-to-r from-transparent via-white/60 to-transparent sm:w-48 md:w-64"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 1.1,
            delay: 0.9,
            ease: "easeOut",
          }}
        />

        <motion.p
          className="text-[0.5rem] uppercase tracking-[0.4em] text-white/75 sm:text-[0.6rem] sm:tracking-[0.45em] leading-loose"
          style={{ fontFamily: 'var(--font-tan-pearl)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 1.25,
            ease: "easeOut",
          }}
        >
          crafted experiences
        </motion.p>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-12 flex items-center justify-center sm:bottom-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.9 }}
      >
        <motion.div
          className="h-px w-40 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-52"
          animate={{ scaleX: [0.4, 1, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

function UltraLuxuryLoaderVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-12 overflow-hidden bg-brand-aurora">
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(255,79,216,0.6), transparent 55%), radial-gradient(circle at 85% 20%, rgba(70,230,255,0.5), transparent 55%), radial-gradient(circle at 10% 100%, rgba(183,164,255,0.45), transparent 60%)",
          backgroundSize: "220% 220%",
        }}
      />

      <motion.div
        className="absolute -top-24 left-1/2 h-[16rem] w-[16rem] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[100px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative flex flex-col items-center gap-6 p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="relative rounded-[1.5rem] border border-white/12 bg-white/6 px-8 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.9)] backdrop-blur-3xl"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute inset-[1px] rounded-[1.375rem] bg-gradient-to-br from-white/12 via-white/4 to-transparent" />

          <div className="relative flex flex-col items-center gap-4 p-12">
            <motion.span
              className="text-[0.6rem] uppercase tracking-[0.6em] text-white/70 leading-loose"
              style={{ fontFamily: 'var(--font-tan-pearl)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              Maison Digitale
            </motion.span>

            <motion.h1
              className="text-step-5 font-hero leading-tight tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 uppercase leading-loose"
              style={{ fontFamily: 'var(--font-tan-pearl)' }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 1.4, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            >
              HUMANTEE
            </motion.h1>

            <motion.div
              className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent sm:w-10" />
              <span className="text-step--1 uppercase tracking-[0.35em] text-white/70 sm:tracking-[0.4em]" style={{ fontFamily: 'var(--font-tan-pearl)' }}>
                crafted experiences
              </span>
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent sm:w-10" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}