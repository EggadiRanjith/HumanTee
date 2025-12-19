/**
 * AuthContext - Memory-Only Token Storage
 * Manages authentication state with secure token handling
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { setAccessToken, getAccessToken, clearAccessToken } from '@/lib/api-client';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (accessToken: string, userData: User) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    // Skip auth check on login page to prevent redirect loops
    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check if on login page
            if (typeof window !== 'undefined' && window.location.pathname === '/login') {
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
                console.error('Failed to merge guest cart:', error);
            }
        }
    };

    const login = async (accessToken: string, userData: User) => {
        setAccessToken(accessToken);
        setUser(userData);

        // Merge guest cart after login
        await mergeGuestCart();
    };

    const handleLogout = async () => {
        try {
            // Call logout endpoint (will use refresh token from cookie)
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Clear memory token and user state
            clearAccessToken();
            setUser(null);

            // Redirect to homepage
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout: handleLogout,
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
