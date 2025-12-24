"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface ProfileWarningProps {
    profileComplete: boolean;
    missingName: boolean;
    missingPhone: boolean;
}

export default function ProfileWarning({
    profileComplete,
    missingName,
    missingPhone,
}: ProfileWarningProps) {
    if (profileComplete) return null;

    return (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <div className="text-amber-400 text-xl mt-0.5">
                <FiAlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className="text-amber-400 font-semibold text-sm">
                    Profile Incomplete
                </h3>
                <p className="text-white/70 text-sm mt-1">
                    Please add your {missingName && 'name'}
                    {missingName && missingPhone && ' and '}
                    {missingPhone && 'phone number'} to unlock all features and
                    complete your checkout.
                </p>
            </div>
        </div>
    );
}
