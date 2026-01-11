import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    private readonly logger = new Logger(UploadController.name);
    constructor(private readonly uploadService: UploadService) { }

    /**
     * Upload single image to Cloudinary
     * POST /upload/image
     */
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @UploadedFile() file: any,
    ): Promise<{ url: string; publicId: string }> {
        this.logger.log('Upload request received', {
            hasFile: !!file,
            mimetype: file?.mimetype,
            size: file?.size,
        });

        if (!file) {
            this.logger.error('No file provided');
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            this.logger.error('Invalid file type', { mimetype: file.mimetype });
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.logger.error('File too large', { size: file.size });
            throw new BadRequestException('File size exceeds 10MB limit');
        }

        try {
            const result = await this.uploadService.uploadImage(file.buffer, 'products');
            this.logger.log('Upload successful', { url: result.url });
            return result;
        } catch (error) {
            this.logger.error('Cloudinary upload failed', error.stack);
            throw error;
        }
    }

    /**
     * Upload single video to Cloudinary
     * POST /upload/video
     */
    @Post('video')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo(
        @UploadedFile() file: any,
    ): Promise<{ url: string; publicId: string }> {
        this.logger.log('Video upload request received', {
            hasFile: !!file,
            mimetype: file?.mimetype,
            size: file?.size,
        });

        if (!file) {
            this.logger.error('No file provided');
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            this.logger.error('Invalid file type', { mimetype: file.mimetype });
            throw new BadRequestException(
                'Invalid file type. Only MP4, WebM, and MOV are allowed.',
            );
        }

        // Validate file size (max 50MB for videos)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            this.logger.error('File too large', { size: file.size });
            throw new BadRequestException('File size exceeds 50MB limit');
        }

        try {
            const result = await this.uploadService.uploadVideo(file.buffer, 'videos');
            this.logger.log('Video upload successful', { url: result.url });
            return result;
        } catch (error) {
            this.logger.error('Cloudinary video upload failed', error.stack);
            throw error;
        }
    }
}
