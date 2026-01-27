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
    login: (accessToken: string, userData: User, cart?: any, addresses?: any[], profile?: any) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // TEMP: Commented out to break circular dependency
    // const { hydrateCart } = useCart();
    const queryClient = useQueryClient();

    // Check authentication status on mount
    // Use refresh token to restore session
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.warn('🔍 Auth check starting...');
                console.warn('Cookies:', document.cookie);

                // Try to refresh session using httpOnly cookie
                const response = await apiClient.post('/auth/refresh', {}, {
                    // Prevent automatic retry on 401 for this initial check
                    validateStatus: (status) => status < 500,
                });

                console.warn('🔍 Refresh response:', {
                    status: response.status,
                    hasData: !!response.data,
                    data: response.data,
                });

                // Only set user if refresh was successful (200 or 201)
                // Backend may return 201 Created instead of 200 OK
                if ((response.status === 200 || response.status === 201) && response.data) {
                    console.warn('✅ Session restored successfully');

                    // Use the existing login function to ensure complete state hydration
                    // (Profile, Cart, Addresses, Sentry, Tab sync)
                    await login(
                        response.data.accessToken,
                        response.data.user,
                        response.data.cart,
                        response.data.addresses,
                        response.data.profile
                    );
                } else {
                    console.warn('❌ Refresh failed - status:', response.status);
                    // 401 or other non-success status = user not logged in
                    setUser(null);
                    clearAccessToken();
                }
            } catch (error) {
                console.error('❌ Auth check error:', error);
                // Network error or other failure - user is not logged in
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
                        price: item.price, // Required by merge endpoint
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
    const login = async (accessToken: string, userData: User, cart?: any, addresses?: any[], profile?: any) => {
        setAccessToken(accessToken);

        // CRITICAL FIX: Merge guest cart BEFORE setting user
        // This prevents CartContext from loading backend cart too early
        // which would cause a race condition and lose guest cart items
        await mergeGuestCart();

        // NOW set user (this triggers CartContext to load backend cart with merged items)
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

        // ✅ OPTIMIZED: Hydrate React Query cache from login payload
        // This prevents redundant API calls after login
        if (profile) {
            // Normalize nested profile structure from backend
            const profileData = profile.profile || {};
            const normalizedProfile = {
                id: profile.id || userData.id,
                email: profile.email || userData.email,
                role: profile.role || userData.role,
                fullName: profileData.fullName,
                phone: profileData.phone,
                avatarUrl: profileData.avatarUrl,
                profileComplete: profile.profileComplete,
            };
            queryClient.setQueryData(queryKeys.user, normalizedProfile);
        } else {
            queryClient.setQueryData(queryKeys.user, userData);
        }

        if (addresses) {
            queryClient.setQueryData(
                queryKeys.addresses(userData.id),
                addresses
            );
        }

        if (cart) {
            queryClient.setQueryData(
                queryKeys.cart(userData.id),
                cart
            );
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
                localStorage.removeItem('humantee-cart'); // Clear guest cart too
                sessionStorage.clear();

                // Manually clear refresh token cookie (NO domain = current hostname only)
                // This prevents session fixation via subdomain attacks
                document.cookie = `refreshToken=; path=/; max-age=0; SameSite=Lax`;
                document.cookie = `auth_token=; path=/; max-age=0; SameSite=Lax`;
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
