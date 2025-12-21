import apiClient from '../api-client';

/**
 * Upload image to Cloudinary via backend
 * @param file - File object from input
 * @returns Cloudinary URL
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.url;
}

/**
 * Upload multiple images in parallel
 * @param files - Array of File objects
 * @returns Array of Cloudinary URLs
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
    return Promise.all(uploadPromises);
}
