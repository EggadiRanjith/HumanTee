import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenBlacklistService } from '../../common/services/token-blacklist.service';

/**
 * Admin JWT Guard
 * Extracts JWT from httpOnly cookie instead of Authorization header
 * SECURITY: Prevents XSS attacks by using httpOnly cookies
 * SECURITY: Checks token blacklist for instant revocation
 * SECURITY: Strict role validation to prevent bypass
 */
@Injectable()
export class AdminJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private tokenBlacklist: TokenBlacklistService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Extract token from httpOnly cookie
        const token = request.cookies['admin_access_token'];

        if (!token) {
            throw new UnauthorizedException('No authentication token found');
        }

        // SECURITY FIX: Check token blacklist FIRST (instant revocation)
        const isBlacklisted = await this.tokenBlacklist.isBlacklisted(token);
        if (isBlacklisted) {
            throw new UnauthorizedException('Token has been revoked');
        }

        try {
            // Verify token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            // SECURITY FIX: Check if user is blacklisted (emergency kill switch)
            const isUserBlacklisted = await this.tokenBlacklist.isUserBlacklisted(payload.sub);
            if (isUserBlacklisted) {
                throw new UnauthorizedException('User access has been revoked. Contact administrator.');
            }

            // SECURITY FIX: Strict role validation (prevent bypass with trailing spaces, null bytes, etc.)
            const VALID_ADMIN_ROLES = ['admin', 'super_admin'];
            const normalizedRole = payload.role?.trim().toLowerCase();

            if (!normalizedRole || !VALID_ADMIN_ROLES.includes(normalizedRole)) {
                throw new UnauthorizedException('Admin access required');
            }

            // Attach user to request with proper field mapping
            request['user'] = {
                userId: payload.sub,  // Map 'sub' to 'userId' for controller compatibility
                role: payload.role,
                email: payload.email,
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
