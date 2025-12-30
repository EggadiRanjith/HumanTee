import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface UserSession {
    userId: string;
    email: string;
    role: string;
    loginAt: Date;
    ipAddress: string;
    userAgent: string;
}

/**
 * Session Service - Production Grade
 * 
 * Features:
 * - Distributed session storage
 * - Multi-device session tracking
 * - JWT blacklist for revoked tokens
 * - Logout from all devices
 */
@Injectable()
export class SessionService {
    private readonly SESSION_TTL = 86400; // 24 hours

    constructor(private readonly redis: RedisService) { }

    /**
     * Create session
     */
    async createSession(sessionId: string, data: UserSession): Promise<void> {
        await this.redis.set(`session:${sessionId}`, data, this.SESSION_TTL);

        // Track user's active sessions (for multi-device management)
        const client = this.redis.getClient();
        await client.sadd(`user:${data.userId}:sessions`, sessionId);
    }

    /**
     * Get session
     */
    async getSession(sessionId: string): Promise<UserSession | null> {
        return this.redis.get<UserSession>(`session:${sessionId}`);
    }

    /**
     * Update session TTL (refresh on activity)
     */
    async refreshSession(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (session) {
            await this.redis.set(`session:${sessionId}`, session, this.SESSION_TTL);
        }
    }

    /**
     * Delete session (logout)
     */
    async deleteSession(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (session) {
            await this.redis.del(`session:${sessionId}`);

            const client = this.redis.getClient();
            await client.srem(`user:${session.userId}:sessions`, sessionId);
        }
    }

    /**
     * Delete all user sessions (logout from all devices)
     */
    async deleteAllUserSessions(userId: string): Promise<void> {
        const client = this.redis.getClient();
        const sessionIds = await client.smembers(`user:${userId}:sessions`);

        if (sessionIds.length > 0) {
            const keys = sessionIds.map(id => `session:${id}`);
            await this.redis.del(...keys);
            await this.redis.del(`user:${userId}:sessions`);
        }
    }

    /**
     * Get all active sessions for a user
     */
    async getUserSessions(userId: string): Promise<UserSession[]> {
        const client = this.redis.getClient();
        const sessionIds = await client.smembers(`user:${userId}:sessions`);

        const sessions: UserSession[] = [];
        for (const sessionId of sessionIds) {
            const session = await this.getSession(sessionId);
            if (session) {
                sessions.push(session);
            }
        }

        return sessions;
    }

    /**
     * JWT Blacklist (for revoked tokens)
     * 
     * Use when:
     * - User logs out
     * - Password changed
     * - Permissions revoked
     */
    async blacklistToken(jti: string, expiresIn: number): Promise<void> {
        await this.redis.set(`blacklist:${jti}`, '1', expiresIn);
    }

    async isTokenBlacklisted(jti: string): Promise<boolean> {
        return this.redis.exists(`blacklist:${jti}`);
    }

    /**
     * Store refresh token
     */
    async storeRefreshToken(
        userId: string,
        refreshToken: string,
        expiresIn: number
    ): Promise<void> {
        await this.redis.set(`refresh:${refreshToken}`, userId, expiresIn);
    }

    /**
     * Validate refresh token
     */
    async validateRefreshToken(refreshToken: string): Promise<string | null> {
        return this.redis.get<string>(`refresh:${refreshToken}`);
    }

    /**
     * Revoke refresh token
     */
    async revokeRefreshToken(refreshToken: string): Promise<void> {
        await this.redis.del(`refresh:${refreshToken}`);
    }
}
