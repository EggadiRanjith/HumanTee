import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
    constructor() {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    /**
     * Upload image to Cloudinary
     * @param file - File buffer from multer
     * @param folder - Cloudinary folder (e.g., 'products')
     * @returns Cloudinary URL and public ID
     */
    async uploadImage(
        file: Buffer,
        folder: string = 'products',
    ): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 2000, height: 2000, crop: 'limit' }, // Max dimensions
                        { quality: 'auto:good' }, // Auto quality optimization
                        { fetch_format: 'auto' }, // Auto format (WebP/AVIF)
                    ],
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (!result) {
                        reject(new Error('Upload failed: No result returned'));
                    } else {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    }
                },
            );

            uploadStream.end(file);
        });
    }

    /**
     * Delete image from Cloudinary
     * @param publicId - Cloudinary public ID
     */
    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}
