/**
 * Login Types
 * Complete type definitions for authentication flow
 */

export type AuthStep = 'email' | 'otp';

export interface LoginFormData {
    email: string;
    otp?: string;
}

export interface AuthError {
    type: 'email' | 'otp' | 'google' | 'network' | 'validation';
    message: string;
    field?: string;
}

export interface GoogleAuthResponse {
    credential: string;
    clientId: string;
    select_by?: string;
}

export interface OTPState {
    code: string;
    expiresAt: Date;
    attempts: number;
}

export interface AuthFlowState {
    step: AuthStep;
    email: string;
    otp: string;
    isLoading: boolean;
    googleLoading: boolean;
    error: string | null;
    googleError: string | null;
    success: boolean;
}

export interface InfoCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}
