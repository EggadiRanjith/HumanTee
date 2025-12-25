"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type HeaderContext = {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
};

const Context = createContext<HeaderContext | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(72);

  return (
    <Context.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </Context.Provider>
  );
}

export function useHeaderContext() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("HeaderProvider missing");
  return ctx;
}
