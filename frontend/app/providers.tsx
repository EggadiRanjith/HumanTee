"use client";

import { LoadingProvider } from "./components/context/LoadingContext";
import { HeaderProvider } from "./components/layout/useHeaderContext";
import { CartProvider } from "./components/context/CartContext";
import { CheckoutProvider } from "./components/context/CheckoutContext";
import { ToastProvider } from "./components/context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { NavigationLoader } from "./components/ui/loaders";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <HeaderProvider>
          <CartProvider>
            <CheckoutProvider>
              <ToastProvider>
                <NavigationLoader />
                {children}
              </ToastProvider>
            </CheckoutProvider>
          </CartProvider>
        </HeaderProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
