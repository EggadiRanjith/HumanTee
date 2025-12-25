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


export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance per component mount (not shared)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <HeaderProvider>
          <CartProvider>
            <AuthProvider>
              <CheckoutProvider>
                <ToastProvider>
                  <NavigationLoader />
                  {children}
                </ToastProvider>
              </CheckoutProvider>
            </AuthProvider>
          </CartProvider>
        </HeaderProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
