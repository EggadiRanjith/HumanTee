import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    /**
     * Upload single image to Cloudinary
     * POST /upload/image
     */
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ url: string; publicId: string }> {
        console.log('Upload request received:', {
            hasFile: !!file,
            mimetype: file?.mimetype,
            size: file?.size,
        });

        if (!file) {
            console.error('No file provided');
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            console.error('Invalid file type:', file.mimetype);
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            console.error('File too large:', file.size);
            throw new BadRequestException('File size exceeds 10MB limit');
        }

        try {
            const result = await this.uploadService.uploadImage(file.buffer, 'products');
            console.log('Upload successful:', result.url);
            return result;
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            throw error;
        }
    }
}
