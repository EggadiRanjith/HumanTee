"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

type HeaderContextValue = {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  animationState: "idle" | "animating";
  setAnimationState: (state: "idle" | "animating") => void;
};

const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(72);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [animationState, setAnimationState] = useState<"idle" | "animating">("idle");

  return (
    <HeaderContext.Provider
      value={{
        headerHeight,
        setHeaderHeight,
        isDrawerOpen,
        setIsDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        animationState,
        setAnimationState,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within HeaderProvider");
  }
  return context;
}

