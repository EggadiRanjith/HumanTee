"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type TransitionProps = {
  children: ReactNode;
  className?: string;
};

export default function Transition({ children, className }: TransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 24,
          clipPath: "inset(0 0 100% 0)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0 0)",
        }}
        exit={{
          opacity: 0,
          y: -20,
          clipPath: "inset(0 0 100% 0)",
        }}
        transition={{
          duration: 0.9,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}