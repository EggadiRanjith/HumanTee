"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LoadingProvider } from "./contexts/LoadingContext";
import { HeaderProvider } from "./components/layout/shared/useHeaderContext";
import { CartProvider } from "./contexts/CartContext";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationLoader } from "./components/ui/loaders";
import ScrollToTop from "./components/ui/ScrollToTop";

// Create QueryClient outside component to prevent recreation on remount
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <HeaderProvider>
          <AuthProvider>
            <CartProvider>
              <CheckoutProvider>
                <ToastProvider>
                  <ScrollToTop />
                  <NavigationLoader />
                  {children}
                </ToastProvider>
              </CheckoutProvider>
            </CartProvider>
          </AuthProvider>
        </HeaderProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
