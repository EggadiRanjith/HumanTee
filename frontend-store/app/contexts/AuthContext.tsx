/**
 * AuthContext - Memory-Only Token Storage
 * Manages authentication state with secure token handling
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { setAccessToken, getAccessToken, clearAccessToken } from '@/lib/api-client';
import { logError } from '@/lib/logger';
import { useCart } from '@/app/contexts/CartContext';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { authSync } from '@/lib/auth/multi-tab-sync';
import { setUserContext, clearUserContext } from '@/lib/monitoring/sentry';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (accessToken: string, userData: User, cart?: any, addresses?: any[]) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { hydrateCart } = useCart();
    const queryClient = useQueryClient();

    // Check authentication status on mount
    // Skip auth check on login page to prevent redirect loops
    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check if on login page or maintenance page
            if (typeof window !== 'undefined' && (
                window.location.pathname === '/login' ||
                window.location.pathname.startsWith('/maintenance')
            )) {
                setIsLoading(false);
                return;
            }

            try {
                // Try to verify session with refresh token (httpOnly cookie)
                const response = await apiClient.get('/auth/me');

                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                // Auth check failed - user will be redirected by interceptor if needed
                setUser(null);
                clearAccessToken();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // PHASE 3: Merge guest cart on login
    const mergeGuestCart = async () => {
        const guestCart = localStorage.getItem('humantee-cart');
        if (guestCart) {
            try {
                const items = JSON.parse(guestCart);
                if (items.length > 0) {
                    // Transform to backend format
                    const backendItems = items.map((item: any) => ({
                        productId: item.id.toString(),
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price,
                        currency: item.currency || 'USD',
                        productTitle: item.title,
                        productImage: item.image,
                        size: item.size,
                    }));

                    await apiClient.post('/cart/merge', { items: backendItems });
                    localStorage.removeItem('humantee-cart');
                }
            } catch (error) {
                logError(error, 'Failed to merge guest cart');
            }
        }
    };

    // Phase 1 + Phase 2: Login with cache hydration
    const login = async (accessToken: string, userData: User, cart?: any, addresses?: any[]) => {
        setAccessToken(accessToken);
        setUser(userData);

        // PRODUCTION: Set Sentry user context for error tracking
        setUserContext({
            id: userData.id,
            email: userData.email,
        });

        // PRODUCTION: Broadcast login to all tabs
        authSync.broadcastLogin({
            id: userData.id,
            email: userData.email,
        });

        // Phase 2: Hydrate React Query cache from login payload
        // This prevents redundant API calls after login
        queryClient.setQueryData(queryKeys.user, userData);

        if (addresses) {
            queryClient.setQueryData(
                queryKeys.addresses(userData.id),
                addresses
            );
        }

        // Phase 1: Hydrate cart
        if (cart) {
            hydrateCart(cart);
        }

        // Merge guest cart (only if no cart data provided)
        if (!cart) {
            await mergeGuestCart();
        }
    };

    const logout = async () => {
        try {
            // Call logout endpoint (will use refresh token from cookie)
            await apiClient.post('/auth/logout');
        } catch (error) {
            logError(error, 'Logout failed');
        } finally {
            // Clear memory token and user state
            clearAccessToken();
            setUser(null);

            // Phase 2: Clear React Query cache on logout
            // Prevents next user seeing previous user's data
            queryClient.clear();

            // SECURITY: Clear sensitive state
            clearUserContext();

            // Clear checkout data (addresses, payment info)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('checkout-data');
                localStorage.removeItem('shipping-address');
                sessionStorage.clear();
            }

            // PRODUCTION: Broadcast logout to all tabs
            authSync.broadcastLogout();

            // Redirect to homepage
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
    };

    // PRODUCTION: Listen for auth events from other tabs
    useEffect(() => {
        authSync.listen((message) => {
            if (message.type === 'LOGOUT') {
                // Another tab logged out - sync this tab
                clearAccessToken();
                setUser(null);
                queryClient.clear();
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
            } else if (message.type === 'LOGIN' && message.user) {
                // Another tab logged in - sync this tab
                setUser({
                    id: message.user.id,
                    email: message.user.email,
                    role: 'customer', // Default role
                });
            }
        });
    }, [queryClient]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
