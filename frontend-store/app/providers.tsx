"use client";

import { LoadingProvider } from "./contexts/LoadingContext";
import { HeaderProvider } from "./components/layout/shared/useHeaderContext";
import { CartProvider } from "./contexts/CartContext";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
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
