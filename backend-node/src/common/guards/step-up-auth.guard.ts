import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Step-Up Authentication Guard
 * Requires re-authentication for dangerous actions
 * Fixes: No step-up auth for destructive operations
 */
@Injectable()
export class StepUpAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Extract step-up token from header
        const stepUpToken = request.headers['x-step-up-token'];

        if (!stepUpToken) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'This action requires re-authentication',
                code: 'STEP_UP_REQUIRED',
                details: {
                    required: true,
                    expiresIn: 300, // 5 minutes
                },
            });
        }

        try {
            // Verify step-up token
            const payload = await this.jwtService.verifyAsync(stepUpToken, {
                secret: process.env.JWT_SECRET,
            });

            // Verify it's a step-up token
            if (payload.type !== 'step-up') {
                throw new UnauthorizedException({
                    statusCode: 401,
                    message: 'Invalid step-up token',
                    code: 'INVALID_STEP_UP_TOKEN',
                });
            }

            // Verify it matches the current user
            if (payload.sub !== request.user?.userId && payload.sub !== request.user?.id) {
                throw new UnauthorizedException({
                    statusCode: 401,
                    message: 'Step-up token does not match current user',
                    code: 'STEP_UP_USER_MISMATCH',
                });
            }

            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new UnauthorizedException({
                statusCode: 401,
                message: 'Invalid or expired step-up token',
                code: 'STEP_UP_TOKEN_INVALID',
            });
        }
    }
}
