import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';

interface GoogleAuthButtonProps {
    onSuccess: (credentialResponse: any) => void;
    onError: () => void;
    isLoading: boolean;
}

export default function GoogleAuthButton({
    onSuccess,
    onError,
    isLoading,
}: GoogleAuthButtonProps) {
    // Use implicit flow with access token (backend supports this)
    // Authorization code flow would require backend changes
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.warn('✅ Google OAuth Success:', tokenResponse);
            onSuccess(tokenResponse);
        },
        onError: (error) => {
            console.error('❌ Google OAuth Error:', error);
            console.error('Error details:', {
                error,
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                origin: window.location.origin,
            });
            onError();
        },
        onNonOAuthError: (error) => {
            // Suppress "popup_closed" errors - this is normal user behavior
            if (error && typeof error === 'object' && 'type' in error && error.type === 'popup_closed') {
                console.warn('⚠️ User closed Google popup');
                return; // Don't call onError for normal cancellation
            }
            console.error('🔴 Google Non-OAuth Error:', error);
            onError();
        },
    });

    return (
        <>
            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black/40 px-2 text-white/40">Or</span>
                </div>
            </div>

            {/* Google Login Button */}
            <div className="relative">
                {/* Custom Luxury Button */}
                <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    onClick={() => {
                        console.warn('🔵 Google button clicked');
                        console.warn('Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
                        console.warn('Origin:', window.location.origin);
                        if (!isLoading) {
                            try {
                                login();
                            } catch (err) {
                                console.error('❌ Login function error:', err);
                            }
                        }
                    }}
                    disabled={isLoading}
                    type="button"
                    className="w-full py-4 bg-gradient-to-r from-white/10 via-white/15 to-white/10 border border-white/20 text-white rounded-xl font-semibold hover:from-white/15 hover:via-white/20 hover:to-white/15 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3 text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <FcGoogle className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">
                        {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
                    </span>
                    {/* Loading spinner */}
                    {isLoading && (
                        <div className="absolute right-4 relative z-10">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </motion.button>
            </div>
        </>
    );
}
