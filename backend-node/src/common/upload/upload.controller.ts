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

        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
            );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds 10MB limit');
        }

        try {
            const result = await this.uploadService.uploadImage(file.buffer, 'products');
            return result;
        } catch (error) {
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

        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only MP4, WebM, and MOV are allowed.',
            );
        }

        // Validate file size (max 50MB for videos)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds 50MB limit');
        }

        try {
            const result = await this.uploadService.uploadVideo(file.buffer, 'videos');
            return result;
        } catch (error) {
            throw error;
        }
    }
}
