import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * AdminRoleGuard
 * FIX 1: Uses composition, not inheritance
 * Only checks role - JWT validation handled by JwtAuthGuard
 */
@Injectable()
export class AdminRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Admin access required');
        }

        return true;
    }
}
