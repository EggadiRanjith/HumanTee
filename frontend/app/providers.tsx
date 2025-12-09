"use client";

import { LoadingProvider } from "./components/context/LoadingContext";
import { HeaderProvider } from "./components/layout/useHeaderContext";
import { CartProvider } from "./components/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <HeaderProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </HeaderProvider>
    </LoadingProvider>
  );
}
