/**
 * Multi-Tab Authentication Synchronization
 * Keeps auth state in sync across browser tabs using BroadcastChannel
 */

const AUTH_CHANNEL = 'auth_sync';

export interface AuthSyncMessage {
    type: 'LOGIN' | 'LOGOUT' | 'TOKEN_REFRESH';
    user?: {
        id: string;
        email: string;
        name?: string;
    };
    timestamp: number;
}

class AuthSync {
    private channel: BroadcastChannel | null = null;

    constructor() {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            this.channel = new BroadcastChannel(AUTH_CHANNEL);
        }
    }

    /**
     * Broadcast login event to all tabs
     */
    broadcastLogin(user: { id: string; email: string; name?: string }) {
        if (!this.channel) return;

        const message: AuthSyncMessage = {
            type: 'LOGIN',
            user,
            timestamp: Date.now(),
        };

        this.channel.postMessage(message);
    }

    /**
     * Broadcast logout event to all tabs
     */
    broadcastLogout() {
        if (!this.channel) return;

        const message: AuthSyncMessage = {
            type: 'LOGOUT',
            timestamp: Date.now(),
        };

        this.channel.postMessage(message);
    }

    /**
     * Broadcast token refresh to all tabs
     */
    broadcastTokenRefresh() {
        if (!this.channel) return;

        const message: AuthSyncMessage = {
            type: 'TOKEN_REFRESH',
            timestamp: Date.now(),
        };

        this.channel.postMessage(message);
    }

    /**
     * Listen for auth events from other tabs
     */
    listen(callback: (message: AuthSyncMessage) => void) {
        if (!this.channel) return;

        this.channel.onmessage = (event) => {
            callback(event.data);
        };
    }

    /**
     * Clean up channel
     */
    destroy() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
    }
}

// Singleton instance
export const authSync = new AuthSync();
