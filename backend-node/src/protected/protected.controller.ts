import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('protected')
export class ProtectedController {
    @UseGuards(JwtAuthGuard)
    @Get('test')
    async testProtectedEndpoint(@Req() req: any) {
        return {
            message: '✅ Protected endpoint accessed successfully',
            user: {
                userId: req.user.userId,
                email: req.user.email,
            },
            timestamp: new Date().toISOString(),
        };
    }
}
