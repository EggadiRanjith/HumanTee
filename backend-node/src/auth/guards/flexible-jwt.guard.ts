import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';

/**
 * Flexible JWT Guard
 * Supports BOTH Authorization header (regular users) AND httpOnly cookie (admin users)
 * Tries cookie first, falls back to header
 */
@Injectable()
export class FlexibleJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private tokenBlacklist: TokenBlacklistService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        let token: string | undefined;
        let source = 'none';

        // PRIORITY 1: Try Authorization header FIRST (regular users)
        // This prevents shared cookie issues on same network
        const authHeader = request.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
            source = 'header';
        }

        // PRIORITY 2: Fall back to cookie (admin users only)
        if (!token) {
            token = request.cookies['admin_access_token'];
            source = 'cookie';
        }

        if (!token) {
            throw new UnauthorizedException('No authentication token found');
        }

        // Check token blacklist
        const isBlacklisted = await this.tokenBlacklist.isBlacklisted(token);
        if (isBlacklisted) {
            throw new UnauthorizedException('Token has been revoked');
        }

        try {
            // Verify token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            // Check if user is blacklisted
            const isUserBlacklisted = await this.tokenBlacklist.isUserBlacklisted(payload.sub);
            if (isUserBlacklisted) {
                throw new UnauthorizedException('User access has been revoked');
            }

            // Attach user to request with proper field mapping
            // Map 'sub' to 'userId' for controller compatibility
            request['user'] = {
                userId: payload.sub,
                email: payload.email,
                role: payload.role,
            };

            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
