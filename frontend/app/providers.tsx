"use client";

import { LoadingProvider } from "./components/context/LoadingContext";
import { HeaderProvider } from "./components/layout/useHeaderContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <HeaderProvider>
        {children}
      </HeaderProvider>
    </LoadingProvider>
  );
}
