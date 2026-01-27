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
    // SECURITY: Use the official hook for custom buttons instead of DOM-selector hacks
    // This is much faster and more reliable in production environments
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.warn('✅ Google OAuth Success:', tokenResponse);
            // NOTE: useGoogleLogin by default returns an access_token response.
            // If your backend specifically needs an ID Token, you'd usually use the component,
            // but the hook is more robust for custom UI.
            // We pass the response to the parent handler.
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
                        {isLoading ? 'Connecting...' : 'Continue with Google'}
                    </span>
                </motion.button>
            </div>
        </>
    );
}
