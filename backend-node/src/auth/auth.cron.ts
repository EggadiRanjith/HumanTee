import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from './auth.service';

@Injectable()
export class AuthCronService {
    private readonly logger = new Logger(AuthCronService.name);

    constructor(private readonly authService: AuthService) { }

    /**
     * Cleanup expired OTPs daily at 2 AM
     */
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleOtpCleanup() {
        try {
            const count = await this.authService.cleanupExpiredOtps();
        } catch (error) {
        }
    }
}
