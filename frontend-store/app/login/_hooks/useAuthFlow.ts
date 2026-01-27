import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { logError } from "@/lib/logger";

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

    const [step, setStep] = useState<AuthStep>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [googleError, setGoogleError] = useState("");
    const [success, setSuccess] = useState("");

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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (!response.ok) {
                throw new Error('Invalid OTP');
            }

            // ✅ OPTIMIZED: Backend returns profile + addresses in login response
            const data = await response.json();
            await authLogin(data.accessToken, data.user, null, data.addresses, data.profile);

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
        setGoogleError("");
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // Detect if we have an ID Token (from component) or Access Token (from hook)
            const payload = credentialResponse.credential
                ? { idToken: credentialResponse.credential }
                : { access_token: credentialResponse.access_token };

            const response = await fetch(`${apiUrl}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                logError(errorData, 'Google login error');
                throw new Error(errorData.message || 'Google login failed');
            }

            // ✅ OPTIMIZED: Backend returns profile + addresses in login response
            const data = await response.json();
            await authLogin(data.accessToken, data.user, null, data.addresses, data.profile);

            // SECURITY: Validate redirect URL against whitelist
            const redirectUrl = validateRedirectUrl(searchParams.get('redirect'));
            router.push(redirectUrl);
        } catch (err: any) {
            logError(err, 'Google login error');
            setGoogleError(err.message || "Google login failed. Please try again.");
        } finally {
            setGoogleLoading(false);
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
        handleSendOtp,
        handleVerifyOtp,
        handleGoogleLogin,
        handleBackToEmail,
    };
}
