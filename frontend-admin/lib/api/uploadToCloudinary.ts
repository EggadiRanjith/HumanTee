import apiClient from '../api-client';

export interface UploadResult {
    url: string;
    publicId: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

/**
 * Upload image to Cloudinary via backend
 * @param file - File object from input
 * @param onProgress - Optional progress callback
 * @returns Cloudinary URL and public ID
 */
export async function uploadImageToCloudinary(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post<UploadResult>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress({
                        loaded: progressEvent.loaded,
                        total: progressEvent.total,
                        percentage,
                    });
                }
            },
        });

        return response.data;
    } catch (error: any) {
        // Enhanced error messages
        if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || 'Invalid file');
        } else if (error.response?.status === 413) {
            throw new Error('File too large');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Upload timeout - please try again');
        } else {
            throw new Error('Upload failed - please try again');
        }
    }
}

/**
 * Upload multiple images in parallel
 * @param files - Array of File objects
 * @param onProgress - Optional progress callback for each file
 * @returns Array of upload results
 */
export async function uploadImagesToCloudinary(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, index) =>
        uploadImageToCloudinary(file, (progress) => onProgress?.(index, progress))
    );
    return Promise.all(uploadPromises);
}
