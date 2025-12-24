import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

type AuthStep = 'email' | 'otp';

export function useAuthFlow() {
    const router = useRouter();
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
            const response = await fetch('http://localhost:3001/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            setSuccess("OTP sent! Check your email.");
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
            const response = await fetch('http://localhost:3001/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (!response.ok) {
                throw new Error('Invalid OTP');
            }

            const data = await response.json();
            await authLogin(data.accessToken, data.user);

            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                router.push('/');
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
            const response = await fetch('http://localhost:3001/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Google login error:', errorData);
                throw new Error(errorData.message || 'Google login failed');
            }

            const data = await response.json();
            await authLogin(data.accessToken, data.user);

            router.push('/');
        } catch (err: any) {
            console.error('Google login error:', err);
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
