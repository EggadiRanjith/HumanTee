/**
 * Settings Back Button Component
 * Provides consistent navigation back to settings overview
 */

"use client";

import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function SettingsBackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/admin/settings')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6"
        >
            <FiArrowLeft className="w-4 h-4" />
            Back to Settings
        </button>
    );
}
