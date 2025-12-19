"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type TransitionOverlayProps = {
  phase: "idle" | "closing" | "opening";
  onClosed: () => void;
  onOpened: () => void;
};

const variants = {
  idle: {
    clipPath: "inset(0% 100% 0% 0%)",
    opacity: 0,
    x: 0,
  },
  closing: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    x: 0,
  },
  opening: {
    clipPath: "inset(0% 100% 0% 0%)",
    opacity: 1,
    x: 50,
  },
};

const transition = {
  duration: 0.75,
  ease: [0.83, 0, 0.17, 1] as const,
};

export default function TransitionOverlay({
  phase,
  onClosed,
  onOpened,
}: TransitionOverlayProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (phase === "closing") {
        await controls.start("closing");
        if (mounted) onClosed();
      } else if (phase === "opening") {
        await controls.start("opening");
        if (mounted) onOpened();
      } else {
        controls.set("idle");
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [phase, controls, onClosed, onOpened]);

  return (
    <motion.div
      initial="idle"
      animate={controls}
      variants={variants}
      transition={transition}
      className="pointer-events-none fixed inset-0 z-[150] bg-gradient-to-r from-black via-[#050505] to-black"
    />
  );
}