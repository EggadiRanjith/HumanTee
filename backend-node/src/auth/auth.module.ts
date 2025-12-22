import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AdminUsersController } from './admin-users.controller';
import { AuthService } from './auth.service';
import { AuthCronService } from './auth.cron';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthUser } from '../entities/auth-user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { OAuthAccount } from '../entities/oauth-account.entity';
import { EmailOtp } from '../entities/email-otp.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { LoginAuditLog } from '../entities/login-audit-log.entity';
import { EmailModule } from '../email/email.module';

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
        ]),
        EmailModule,
    ],
    controllers: [AuthController, AdminUsersController],
    providers: [AuthService, AuthCronService, JwtStrategy, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule { }
