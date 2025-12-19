"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import TransitionOverlay from "./TransitionOverlay";

type TransitionPhase = "idle" | "closing" | "opening";

type PageTransitionContextValue = {
  startTransition: (path: string) => void;
  isTransitioning: boolean;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

export function PageTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const targetPathRef = useRef<string | null>(null);

  const startTransition = useCallback(
    (path: string) => {
      if (!path || path === pathname || phase === "closing") return;
      targetPathRef.current = path;
      setPhase("closing");
    },
    [pathname, phase],
  );

  const handleClosed = useCallback(() => {
    if (targetPathRef.current) {
      router.push(targetPathRef.current);
    }
    setPhase("opening");
  }, [router]);

  const handleOpened = useCallback(() => {
    targetPathRef.current = null;
    setPhase("idle");
  }, []);

  const value = useMemo<PageTransitionContextValue>(
    () => ({
      startTransition,
      isTransitioning: phase !== "idle",
    }),
    [phase, startTransition],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      {phase !== "idle" && (
        <TransitionOverlay
          phase={phase}
          onClosed={handleClosed}
          onOpened={handleOpened}
        />
      )}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransitionContext() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransitionContext must be used within PageTransitionProvider",
    );
  }
  return context;
}