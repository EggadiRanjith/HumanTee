import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Token Blacklist Service
 * Provides instant token revocation using in-memory storage
 * Fixes: Token revocation delay (15-minute window)
 * 
 * NOTE: In production, replace with Redis for persistence across restarts
 */
@Injectable()
export class TokenBlacklistService {
    private tokenBlacklist = new Map<string, number>(); // token -> expiry timestamp
    private userBlacklist = new Map<string, number>(); // userId -> expiry timestamp

    constructor(private jwtService: JwtService) {
        // Clean up expired tokens every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    /**
     * Revoke a token immediately
     * Token will be blacklisted until its natural expiration
     */
    async revokeToken(token: string): Promise<void> {
        try {
            const decoded = this.jwtService.decode(token) as any;

            if (!decoded || !decoded.exp) {
                return; // Invalid token, nothing to revoke
            }

            // Store token with its expiry timestamp
            this.tokenBlacklist.set(token, decoded.exp * 1000);
        } catch (error) {
            // Log error but don't throw - revocation failure shouldn't break logout
        }
    }

    /**
     * Check if a token is blacklisted
     */
    async isBlacklisted(token: string): Promise<boolean> {
        const expiry = this.tokenBlacklist.get(token);
        if (!expiry) return false;

        // Check if token has expired
        if (Date.now() > expiry) {
            this.tokenBlacklist.delete(token);
            return false;
        }

        return true;
    }

    /**
     * Revoke all tokens for a user (emergency kill switch)
     */
    async revokeAllUserTokens(userId: string): Promise<void> {
        // Blacklist user for 24 hours
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        this.userBlacklist.set(userId, expiryTime);
    }

    /**
     * Check if all user tokens are blacklisted
     */
    async isUserBlacklisted(userId: string): Promise<boolean> {
        const expiry = this.userBlacklist.get(userId);
        if (!expiry) return false;

        // Check if blacklist has expired
        if (Date.now() > expiry) {
            this.userBlacklist.delete(userId);
            return false;
        }

        return true;
    }

    /**
     * Remove user from blacklist (restore access)
     */
    async unblacklistUser(userId: string): Promise<void> {
        this.userBlacklist.delete(userId);
    }

    /**
     * Clean up expired entries
     */
    private cleanup(): void {
        const now = Date.now();

        // Clean token blacklist
        for (const [token, expiry] of this.tokenBlacklist.entries()) {
            if (now > expiry) {
                this.tokenBlacklist.delete(token);
            }
        }

        // Clean user blacklist
        for (const [userId, expiry] of this.userBlacklist.entries()) {
            if (now > expiry) {
                this.userBlacklist.delete(userId);
            }
        }
    }
}
