"use client";

import { useCallback } from "react";
import { usePageTransitionContext } from "./PageTransitionProvider";

export function usePageTransition() {
  const { startTransition, isTransitioning } = usePageTransitionContext();

  const navigate = useCallback(
    (path: string) => {
      startTransition(path);
    },
    [startTransition],
  );

  return { navigate, isTransitioning };
}