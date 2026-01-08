import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { StepUpAuthGuard } from './guards/step-up-auth.guard';

/**
 * Common Module
 * Provides shared services and guards across the application
 * @Global decorator makes it available everywhere without importing
 * 
 * NOTE: BlastRadiusGuard is not included here because it depends on AdminAuditService
 * which is in AuthModule. It should be provided in modules that import AuthModule.
 */
@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default-secret',
            signOptions: { expiresIn: '15m' },
        }),
    ],
    providers: [
        TokenBlacklistService,
        StepUpAuthGuard,
    ],
    exports: [
        TokenBlacklistService,
        StepUpAuthGuard,
        JwtModule,
    ],
})
export class CommonModule { }
