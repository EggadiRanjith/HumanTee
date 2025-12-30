"use client";

import dynamic from "next/dynamic";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthFlow } from "./_hooks/useAuthFlow";
import LoginBranding from "./_components/LoginBranding";
import EmailForm from "./_components/EmailForm";
import OTPForm from "./_components/OTPForm";
import GoogleAuthButton from "./_components/GoogleAuthButton";
import InfoCards from "./_components/InfoCards";

// Lazy load LaserFlow for performance
const LaserFlow = dynamic(
    () => import("../components/ui/LaserFlow").then(mod => ({ default: mod.LaserFlow })),
    { ssr: false }
);

export default function LoginPage() {
    const {
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
    } = useAuthFlow();

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <>
                <style>
                    {`
                /* Performance optimizations */
                .laser-responsive {
                    will-change: transform;
                    transform: translate3d(-50%, -20%, 0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                .card-responsive {
                    will-change: transform;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                
                /* Autofill styling fix - Bulletproof version */
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 1000px #060010 inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s !important;
                }
                
                @media (max-width: 768px) {
                    .laser-responsive {
                        transform: translate3d(-50%, -25%, 0) scale(0.88) !important;
                    }
                    .card-responsive {
                        top: 15% !important;
                    }
                }
                `}
                </style>

                <div
                    style={{
                        minHeight: "100vh",
                        width: "100%",
                        position: "relative",
                        backgroundColor: "#060010",
                        overflowX: "hidden",
                    }}
                >
                    <div
                        style={{
                            minHeight: "130vh",
                            position: "relative",
                            overflowY: "auto",
                            overflowX: "hidden",
                            paddingBottom: "300px",
                        }}
                    >
                        {/* LASER FIELD */}
                        <div
                            className="laser-responsive"
                            style={{
                                position: "absolute",
                                top: 0,
                                width: "100%",
                                minWidth: "1200px",
                                left: "50%",
                                transform: "translate(-50%, -20%)",
                                minHeight: "660px",
                                height: "60%",
                                zIndex: 1,
                                clipPath: "inset(20% 0 0 0)",
                            }}
                        >
                            <LaserFlow
                                horizontalBeamOffset={0}
                                color="#FF79C6"
                                dpr={1}
                            />
                        </div>

                        {/* AURA */}
                        <div
                            style={{
                                position: "absolute",
                                top: "30%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "90%",
                                height: "500px",
                                filter: "blur(40px)",
                                background:
                                    "radial-gradient(circle, rgba(255,121,198,0.6), rgba(255,121,198,0) 70%)",
                                zIndex: 5,
                                pointerEvents: "none",
                            }}
                        />

                        {/* CARD CONTAINER */}
                        <div
                            style={{
                                position: "absolute",
                                top: "18%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "94%",
                                maxWidth: "1200px",
                                height: "auto",
                                minHeight: "60%",
                                background: "linear-gradient(to bottom, rgba(6,0,16,0) 0%, rgba(6,0,16,0.8) 40%, #060010 100%)",
                                borderRadius: "0px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                borderImage: "linear-gradient(to bottom, transparent 0%, #FF79C6 50%) 1",
                                borderTop: "none",
                                zIndex: 10,
                            }}
                            className="flex flex-col lg:flex-row overflow-hidden card-responsive"
                        >
                            {/* Left Side - Branding */}
                            <LoginBranding />

                            {/* Right Side - Auth Form */}
                            <div className="lg:w-1/2 p-8 lg:p-12 bg-black/20 flex flex-col justify-center relative">
                                {/* Glow for form side */}
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none"></div>

                                <div className="relative z-10 w-full max-w-sm mx-auto">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {step === 'email' ? 'Welcome' : 'Verify OTP'}
                                        </h2>
                                        <p className="text-white/60">
                                            {step === 'email'
                                                ? 'Sign in or create an account'
                                                : `Enter the 6-digit code sent to ${email}`
                                            }
                                        </p>
                                    </div>

                                    {step === 'email' ? (
                                        <>
                                            <EmailForm
                                                email={email}
                                                onEmailChange={setEmail}
                                                onSubmit={handleSendOtp}
                                                isLoading={isLoading}
                                                error={error}
                                                success={success}
                                            />

                                            <GoogleAuthButton
                                                onSuccess={handleGoogleLogin}
                                                onError={() => {
                                                    // googleError state is managed in useAuthFlow
                                                }}
                                                isLoading={googleLoading}
                                            />

                                            {/* Google Error Message */}
                                            {googleError && (
                                                <p className="text-red-400 text-xs mt-2 ml-1">
                                                    {googleError}
                                                </p>
                                            )}

                                            <InfoCards />
                                        </>
                                    ) : (
                                        <OTPForm
                                            email={email}
                                            otp={otp}
                                            onOtpChange={setOtp}
                                            onSubmit={handleVerifyOtp}
                                            onBackToEmail={handleBackToEmail}
                                            onResendOtp={handleSendOtp}
                                            isLoading={isLoading}
                                            error={error}
                                            success={success}
                                        />
                                    )}

                                    <p className="text-white/40 text-[10px] text-center mt-8 leading-relaxed">
                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        </GoogleOAuthProvider>
    );
}
