"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from '@react-oauth/google';

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
                        // Trigger the hidden Google button
                        const googleBtn = document.querySelector(
                            '[aria-labelledby="button-label"]'
                        ) as HTMLButtonElement;
                        if (googleBtn) googleBtn.click();
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

                {/* Hidden Google Login Component */}
                <div className="absolute opacity-0 pointer-events-none -z-10">
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        useOneTap={false}
                        auto_select={false}
                    />
                </div>
            </div>
        </>
    );
}
