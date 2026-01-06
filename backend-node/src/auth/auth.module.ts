import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AdminUsersController } from './admin-users.controller';
import { AuditLogsController } from './audit-logs.controller';
import { AdminUserAuditController } from './admin-user-audit.controller';
import { AuthService } from './auth.service';
import { AuthCronService } from './auth.cron';
import { LoginAggregationService } from './login-aggregation.service';
import { AdminAuditService } from './admin-audit.service';
import { LoginAuditService } from './login-audit.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthUser } from '../entities/auth-user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { OAuthAccount } from '../entities/oauth-account.entity';
import { EmailOtp } from '../entities/email-otp.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { LoginAuditLog } from '../entities/login-audit-log.entity';
import { AdminAuditLog } from '../entities/admin-audit-log.entity';
import { UserAuditLog } from '../entities/user-audit-log.entity';
import { UserAuditService } from './user-audit.service';
import { EmailModule } from '../email/email.module';
import { CartModule } from '../cart/cart.module';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
            AuthUser,
            RefreshToken,
            OAuthAccount,
            EmailOtp,
            UserProfile,
            LoginAuditLog,
            AdminAuditLog,
            UserAuditLog,
        ]),
        EmailModule,
        CartModule,
        ShippingModule,
    ],
    controllers: [AuthController, AdminUsersController, AuditLogsController, AdminUserAuditController],
    providers: [AuthService, AuthCronService, LoginAggregationService, AdminAuditService, LoginAuditService, UserAuditService, JwtStrategy, GoogleStrategy],
    exports: [AuthService, AdminAuditService, LoginAuditService, UserAuditService],
})
export class AuthModule { }
