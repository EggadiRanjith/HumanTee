"use client";

import { LoadingProvider } from "./components/context/LoadingContext";
import { HeaderProvider } from "./components/layout/useHeaderContext";
import { CartProvider } from "./components/context/CartContext";
import { CheckoutProvider } from "./components/context/CheckoutContext";
import { NavigationLoader } from "./components/ui/loaders";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <HeaderProvider>
        <CartProvider>
          <CheckoutProvider>
            <NavigationLoader />
            {children}
          </CheckoutProvider>
        </CartProvider>
      </HeaderProvider>
    </LoadingProvider>
  );
}
