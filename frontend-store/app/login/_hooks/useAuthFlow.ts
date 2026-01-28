import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useLoading } from "@/app/contexts/LoadingContext";
import { logError } from "@/lib/logger";
import apiClient from "@/lib/api-client";

type AuthStep = 'email' | 'otp';

// SECURITY: Whitelist of allowed redirect paths to prevent open redirect attacks
const ALLOWED_REDIRECT_PREFIXES = [
    '/',
    '/checkout',
    '/cart',
    '/orders',
    '/account',
    '/shop',
    '/product/',
    '/contact',
];

/**
 * Validates redirect URL to prevent open redirect attacks
 * Only allows internal paths that start with known safe prefixes
 */
function validateRedirectUrl(url: string | null): string {
    if (!url) return '/';

    // Must start with / and not be a protocol-relative URL
    if (!url.startsWith('/') || url.startsWith('//')) {
        return '/';
    }

    // Check against whitelist
    const isAllowed = ALLOWED_REDIRECT_PREFIXES.some(prefix =>
        url === prefix || url.startsWith(prefix)
    );

    return isAllowed ? url : '/';
}

export function useAuthFlow() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login: authLogin } = useAuth();
    const { setLoading } = useLoading();

    const [step, setStep] = useState<AuthStep>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [googleError, setGoogleError] = useState("");
    const [success, setSuccess] = useState("");
    const [googleSuccess, setGoogleSuccess] = useState("");

    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSendOtp = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post('/auth/send-otp', { email });
            setSuccess("OTP sent! Check your email.");
            // Clear success after a short delay to prevent OTP button from being disabled
            setTimeout(() => setSuccess(""), 1500);
            setStep('otp');
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp.trim() || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await apiClient.post<{
                accessToken: string;
                user: any;
                addresses?: any[];
                profile?: any;
            }>('/auth/verify-otp', { email, otp });
            await authLogin(data.accessToken, data.user, undefined, data.addresses, data.profile);

            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                // SECURITY: Validate redirect URL against whitelist
                const redirectUrl = validateRedirectUrl(searchParams.get('redirect'));
                router.push(redirectUrl);
            }, 1000);
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: any) => {
        setGoogleLoading(true);
        setLoading(true); // Show global full-screen loader
        setGoogleError("");
        setGoogleSuccess("");
        setError("");

        try {
            const payload = credentialResponse.credential
                ? { idToken: credentialResponse.credential }
                : { access_token: credentialResponse.access_token };

            const { data } = await apiClient.post<{
                accessToken: string;
                user: any;
                addresses?: any[];
                profile?: any;
            }>('/auth/google', payload);
            await authLogin(data.accessToken, data.user, undefined, data.addresses, data.profile);

            // Show success message
            setGoogleSuccess("Login successful! Redirecting...");

            // Brief delay to show success message
            await new Promise(resolve => setTimeout(resolve, 500));

            // SECURITY: Validate redirect URL against whitelist
            const redirectUrl = validateRedirectUrl(searchParams.get('redirect'));
            router.push(redirectUrl);
        } catch (err: any) {
            logError(err, 'Google login error');
            setGoogleError(err.message || "Google login failed. Please try again.");
        } finally {
            setGoogleLoading(false);
            setLoading(false); // Hide global loader
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOtp("");
        setError("");
        setSuccess("");
    };

    return {
        step,
        email,
        setEmail,
        otp,
        setOtp,
        isLoading,
        googleLoading,
        error,
        googleError,
        success,
        googleSuccess,
        handleSendOtp,
        handleVerifyOtp,
        handleGoogleLogin,
        handleBackToEmail,
    };
}
