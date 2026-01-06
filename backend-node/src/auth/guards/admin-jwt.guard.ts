import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Admin JWT Guard
 * Extracts JWT from httpOnly cookie instead of Authorization header
 * SECURITY: Prevents XSS attacks by using httpOnly cookies
 */
@Injectable()
export class AdminJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Extract token from httpOnly cookie
        const token = request.cookies['admin_access_token'];

        if (!token) {
            throw new UnauthorizedException('No authentication token found');
        }

        try {
            // Verify token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            // Verify user is admin
            if (payload.role?.toLowerCase() !== 'admin') {
                throw new UnauthorizedException('Admin access required');
            }

            // Attach user to request
            request['user'] = payload;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
