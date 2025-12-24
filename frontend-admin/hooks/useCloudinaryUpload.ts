import { useState } from 'react';
import apiClient from '@/lib/api-client';

interface UploadOptions {
    maxSize?: number;
    allowedTypes?: string[];
}

export function useCloudinaryUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const upload = async (
        file: File,
        options?: UploadOptions
    ): Promise<string | null> => {
        // Validate file size
        const maxSize = options?.maxSize || 5 * 1024 * 1024; // Default 5MB
        if (file.size > maxSize) {
            setError(`File too large. Maximum ${maxSize / 1024 / 1024}MB`);
            return null;
        }

        // Validate file type
        if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
            setError('Invalid file type');
            return null;
        }

        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setProgress(percentCompleted);
                }
            });

            return response.data.url;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Upload failed');
            return null;
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const reset = () => {
        setError(null);
        setProgress(0);
    };

    return { upload, uploading, error, progress, reset };
}
