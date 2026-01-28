"use client";

import { useEffect, useState } from "react";

/**
 * Lightweight runtime Safari detection.
 * Used to gracefully disable heavy visual effects that are unstable on Safari.
 */
export function useIsSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const ua = navigator.userAgent;
    const isSafariBrowser =
      /safari/i.test(ua) &&
      !/chrome|chromium|android|crios|fxios|edge/i.test(ua);

    setIsSafari(isSafariBrowser);
  }, []);

  return isSafari;
}

