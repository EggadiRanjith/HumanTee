/**
 * Admin AuthContext - httpOnly Cookie Authentication
 * SECURITY: Uses httpOnly cookies instead of localStorage
 * Prevents XSS attacks by not exposing tokens to JavaScript
 */

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    role: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    sendOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check if on login page
            if (typeof window !== 'undefined' && window.location.pathname === '/login') {
                setIsLoading(false);
                return;
            }

            try {
                // Verify session using httpOnly cookie
                // Cookie is sent automatically by browser
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    method: 'GET',
                    credentials: 'include',  // Send httpOnly cookies
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    // Verify user is admin
                    if (data.role?.toLowerCase() === 'admin') {
                        setUser(data);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    /**
     * Send OTP to admin email
     */
    const sendOtp = async (email: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/send-otp`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send OTP');
        }

        return response.json();
    };

    /**
     * Verify OTP and login
     * SECURITY: Backend sets httpOnly cookies, no token in response
     */
    const verifyOtp = async (email: string, otp: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/verify-otp`, {
            method: 'POST',
            credentials: 'include',  // Receive httpOnly cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid OTP');
        }

        const data = await response.json();

        // Verify user is admin
        if (data.user.role?.toLowerCase() !== 'admin') {
            throw new Error('Admin access required');
        }

        // Set user state immediately (cookies are already set by backend)
        setUser(data.user);

        // NO TOKEN STORAGE - Cookies are automatic ✅
    };

    /**
     * Logout - Clears httpOnly cookies
     */
    const logout = async () => {
        try {
            // Call logout endpoint to clear cookies
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            // Logout failed, but clear local state anyway

        } finally {
            // Clear user state
            setUser(null);

            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                sendOtp,
                verifyOtp,
                logout,
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
