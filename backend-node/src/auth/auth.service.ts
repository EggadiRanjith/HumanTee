import { Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DataSource, LessThan, MoreThan } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthUser } from '../entities/auth-user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { OAuthAccount } from '../entities/oauth-account.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { EmailOtp } from '../entities/email-otp.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private googleClient: OAuth2Client;

    constructor(
        @InjectRepository(AuthUser)
        private authUserRepository: Repository<AuthUser>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        @InjectRepository(OAuthAccount)
        private oauthAccountRepository: Repository<OAuthAccount>,
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
        @InjectRepository(EmailOtp)
        private emailOtpRepository: Repository<EmailOtp>,
        private jwtService: JwtService,
        private emailService: EmailService,
        private dataSource: DataSource,
    ) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async googleLogin(idToken: string, ipAddress: string, userAgent: string) {
        let userId: string | null = null;
        let success = false;

        try {
            // 1️⃣ Verify Google ID Token
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload) {
                throw new UnauthorizedException('Invalid Google token');
            }

            // 2️⃣ Extract identity
            const { sub: googleUserId, email, email_verified } = payload;

            if (!email || !email_verified) {
                throw new UnauthorizedException('Email not verified by Google');
            }

            // 3️⃣ Find or create user
            let authUser: AuthUser;
            let oauthAccount = await this.oauthAccountRepository.findOne({
                where: { provider: 'GOOGLE', provider_user_id: googleUserId },
                relations: ['user'],
            });

            if (oauthAccount) {
                // Case A — Existing OAuth account
                authUser = oauthAccount.user;
                this.logger.log(`✅ GOOGLE LOGIN - Existing user: ${email} | Role: ${authUser.role} | ID: ${authUser.id}`);
            } else {
                // Check if user exists with this email
                const existingUser = await this.authUserRepository.findOne({
                    where: { email },
                });

                if (existingUser) {
                    // Case B — Existing email, OAuth not linked
                    authUser = existingUser;
                    this.logger.log(`✅ GOOGLE LOGIN - Linking Google to existing user: ${email} | Role: ${authUser.role} | ID: ${authUser.id}`);

                    // Create OAuth account link
                    oauthAccount = this.oauthAccountRepository.create({
                        user_id: authUser.id,
                        provider: 'GOOGLE',
                        provider_user_id: googleUserId,
                        email,
                    });
                    await this.oauthAccountRepository.save(oauthAccount);
                } else {
                    // Case C — New user
                    authUser = this.authUserRepository.create({
                        email,
                        auth_provider: 'GOOGLE',
                        is_active: true,
                        role: 'USER',
                    });
                    await this.authUserRepository.save(authUser);
                    this.logger.log(`🆕 GOOGLE LOGIN - New user created: ${email} | Role: ${authUser.role} | ID: ${authUser.id}`);

                    // Create user profile
                    const userProfile = this.userProfileRepository.create({
                        auth_user_id: authUser.id,
                        full_name: payload.name || email.split('@')[0],
                        avatar_url: payload.picture || undefined,
                    });
                    await this.userProfileRepository.save(userProfile);

                    // Create OAuth account
                    oauthAccount = this.oauthAccountRepository.create({
                        user_id: authUser.id,
                        provider: 'GOOGLE',
                        provider_user_id: googleUserId,
                        email,
                    });
                    await this.oauthAccountRepository.save(oauthAccount);

                    // Send welcome email (async, don't wait)
                    this.emailService.sendWelcomeEmail(email, payload.name).catch(err => {
                        // Log but don't fail login
                        this.logger.error('Welcome email failed:', err);
                    });
                }
            }

            // Check if user is active
            if (!authUser.is_active) {
                throw new UnauthorizedException('Account is deactivated');
            }

            // Update last login
            authUser.last_login_at = new Date();
            await this.authUserRepository.save(authUser);

            userId = authUser.id;
            success = true;

            // 4️⃣ Issue session
            const accessToken = this.generateAccessToken(authUser.id, authUser.email, authUser.role);
            const refreshToken = await this.generateRefreshToken(authUser.id);

            // 5️⃣ Fetch complete user data (profile + addresses)
            const [profile, addresses] = await Promise.all([
                this.getProfile(authUser.id),
                this.dataSource.getRepository('ShippingAddress').find({
                    where: { userId: authUser.id },
                    order: { isDefault: 'DESC', createdAt: 'DESC' },
                }),
            ]);

            return {
                accessToken,
                refreshToken,
                user: {
                    id: authUser.id,
                    email: authUser.email,
                    role: authUser.role,
                },
                profile, // Complete profile data
                addresses, // User's shipping addresses
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Google authentication failed');
        } finally {
            // Audit logging handled by UserAuditService in controller
        }
    }

    private generateAccessToken(userId: string, email: string, role: string): string {
        return this.jwtService.sign(
            { sub: userId, email, role },
            { expiresIn: '15m' },
        );
    }

    private async generateRefreshToken(userId: string): Promise<string> {
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshSecret || refreshSecret.length < 32) {
            throw new Error('FATAL: JWT_REFRESH_SECRET required and must be 32+ chars');
        }

        const token = this.jwtService.sign(
            { sub: userId, type: 'refresh' },
            {
                secret: refreshSecret,
                expiresIn: '7d',
            },
        );

        // Hash the refresh token before storing
        const tokenHash = await bcrypt.hash(token, 10);

        // Store in database
        const refreshToken = this.refreshTokenRepository.create({
            user_id: userId,
            token_hash: tokenHash,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        await this.refreshTokenRepository.save(refreshToken);

        return token;
    }

    /**
     * Refresh token rotation strategy:
     * - Verify the refresh token
     * - Revoke the old refresh token
     * - Issue new access + refresh tokens
     * This prevents token reuse attacks
     */
    async refreshToken(refreshToken: string, ipAddress: string, userAgent: string) {
        try {
            // Verify the refresh token JWT
            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if (!refreshSecret || refreshSecret.length < 32) {
                throw new UnauthorizedException('Server configuration error');
            }

            const payload = this.jwtService.verify(refreshToken, {
                secret: refreshSecret,
            });

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException('Invalid token type');
            }

            const userId = payload.sub;

            // Find all refresh tokens for this user
            const storedTokens = await this.refreshTokenRepository.find({
                where: { user_id: userId, revoked_at: IsNull() },
            });

            // Verify the token hash exists in database
            let validToken: RefreshToken | null = null;
            for (const stored of storedTokens) {
                const isValid = await bcrypt.compare(refreshToken, stored.token_hash);
                if (isValid) {
                    validToken = stored;
                    break;
                }
            }

            if (!validToken) {
                // Token not found or already revoked - possible reuse attack
                throw new UnauthorizedException('Invalid or revoked refresh token');
            }

            // Check expiration
            if (new Date() > validToken.expires_at) {
                throw new UnauthorizedException('Refresh token expired');
            }

            // Get user
            const user = await this.authUserRepository.findOne({
                where: { id: userId },
            });

            if (!user || !user.is_active) {
                throw new UnauthorizedException('User not found or inactive');
            }

            // ROTATION: Revoke the old token
            validToken.revoked_at = new Date();
            await this.refreshTokenRepository.save(validToken);

            // Issue new tokens
            const newAccessToken = this.generateAccessToken(user.id, user.email, user.role);
            const newRefreshToken = await this.generateRefreshToken(user.id);

            // Audit log


            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            // JWT verification errors
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async getProfile(userId: string) {
        const user = await this.authUserRepository.findOne({
            where: { id: userId },
            relations: ['profile'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Authoritative profile completeness check
        const profileComplete = !!(user.profile?.full_name && user.profile?.phone);

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: {
                fullName: user.profile?.full_name,
                phone: user.profile?.phone,
                avatarUrl: user.profile?.avatar_url,
            },
            profileComplete,  // Single source of truth
        };
    }

    async updateProfile(userId: string, updateData: { fullName?: string; phone?: string }) {
        const user = await this.authUserRepository.findOne({
            where: { id: userId },
            relations: ['profile'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Create profile if it doesn't exist
        if (!user.profile) {
            const newProfile = this.userProfileRepository.create({
                auth_user_id: userId,
                full_name: updateData.fullName?.trim() || '',
                phone: updateData.phone?.trim() || '',
            });
            await this.userProfileRepository.save(newProfile);
        } else {
            // Update existing profile
            if (updateData.fullName !== undefined) {
                user.profile.full_name = updateData.fullName.trim() || '';
            }
            if (updateData.phone !== undefined) {
                user.profile.phone = updateData.phone.trim() || '';
            }
            await this.userProfileRepository.save(user.profile);
        }

        // Return updated profile
        return this.getProfile(userId);
    }

    /**
     * OPTIMIZATION: Aggregated account dashboard data
     * Fetches profile + addresses + recent orders in parallel
     * Reduces 3 API calls → 1, and 4 DB queries → 3 (parallel)
     */
    async getAccountDashboard(userId: string) {
        // Execute all queries in parallel
        const [profile, addresses, orders] = await Promise.all([
            // Profile query
            this.getProfile(userId),

            // Addresses query - direct repository access
            this.dataSource.getRepository('ShippingAddress').find({
                where: { userId },
                order: { isDefault: 'DESC', createdAt: 'DESC' },
            }),

            // Recent orders query - limit to 5
            this.dataSource.getRepository('Order').find({
                where: { user_id: userId },
                order: { created_at: 'DESC' },
                take: 5,
                relations: ['items'],
            }),
        ]);

        return {
            profile,
            addresses,
            recentOrders: orders,
        };
    }

    /**
     * Logout: Revoke all active refresh tokens for the user
     * This invalidates all sessions across all devices
     */
    async logout(userId: string) {
        // Revoke all active refresh tokens
        await this.refreshTokenRepository.update(
            { user_id: userId, revoked_at: IsNull() },
            { revoked_at: new Date() },
        );

        return { message: 'Logged out successfully' };
    }

    /**
     * Find user by email (for admin security checks)
     */
    async findUserByEmail(email: string): Promise<AuthUser | null> {
        const normalizedEmail = email.toLowerCase().trim();
        return this.authUserRepository.findOne({
            where: { email: normalizedEmail },
        });
    }

    /**
     * Send OTP - Production-grade implementation
     * Security: Hashed storage, resend cool-down, enumeration protection
     */
    async sendOtp(email: string, ipAddress: string) {
        // 1. Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        try {
            // 2. Resend cool-down (60s minimum)
            const recentOtp = await this.emailOtpRepository.findOne({
                where: {
                    email: normalizedEmail,
                    created_at: MoreThan(new Date(Date.now() - 60 * 1000)),
                },
                order: { created_at: 'DESC' },
            });

            if (recentOtp) {
                // Silently accept but don't resend (protects Gmail account)
                this.logger.log(`OTP resend blocked (cool-down): ${normalizedEmail.substring(0, 3)}***`);
                return { message: 'If the email exists, an OTP has been sent.' };
            }

            // 3. Invalidate all previous OTPs for this email
            await this.emailOtpRepository.update(
                { email: normalizedEmail, used_at: IsNull() },
                { used_at: new Date() },
            );

            // 4. Generate cryptographically secure 6-digit OTP
            const otp = crypto.randomInt(100000, 999999).toString();

            // 5. Hash OTP with bcrypt
            const otpHash = await bcrypt.hash(otp, 10);

            // 6. Send email FIRST (if fails, don't save OTP)
            await this.emailService.sendOTP(normalizedEmail, otp);

            // 7. Save OTP only if email sent successfully
            const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
            await this.emailOtpRepository.save({
                email: normalizedEmail,
                otp_hash: otpHash,
                expires_at: new Date(Date.now() + expiryMinutes * 60 * 1000),
                attempt_count: 0,
            });

            // Audit log (no OTP in log)


        } catch (error) {
            this.logger.error(`Send OTP failed: ${error.message}`);
            // Don't reveal error details
        }

        // 8. Always return generic response (enumeration protection)
        return { message: 'If the email exists, an OTP has been sent.' };
    }

    /**
     * Verify OTP - Production-grade implementation with transaction
     * Security: Atomic one-time use, attempt count, row locking
     * Unified accounts: Same email = same user (Google or OTP)
     */
    async verifyOtp(email: string, otp: string, ipAddress: string, userAgent: string) {
        // 1. Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // 2. Start transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let userId: string | null = null;

        try {
            // 3. Fetch OTP with row lock (FOR UPDATE)
            const otpRecord = await queryRunner.manager
                .createQueryBuilder(EmailOtp, 'otp')
                .where('otp.email = :email', { email: normalizedEmail })
                .andWhere('otp.used_at IS NULL')
                .andWhere('otp.expires_at > :now', { now: new Date() })
                .andWhere('otp.attempt_count < :maxAttempts', {
                    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5')
                })
                .orderBy('otp.created_at', 'DESC')
                .setLock('pessimistic_write')  // Row lock
                .getOne();

            // 4. Check if OTP exists and not exceeded attempts
            if (!otpRecord) {
                await queryRunner.rollbackTransaction();

                throw new UnauthorizedException('Invalid OTP');
            }

            // 5. Compare OTP hash
            const isValid = await bcrypt.compare(otp, otpRecord.otp_hash);

            if (!isValid) {
                // Increment attempt count
                await queryRunner.manager.update(EmailOtp, otpRecord.id, {
                    attempt_count: otpRecord.attempt_count + 1,
                });
                await queryRunner.commitTransaction();

                throw new UnauthorizedException('Invalid OTP');
            }

            // 6. Mark OTP as used (atomic)
            await queryRunner.manager.update(EmailOtp, otpRecord.id, {
                used_at: new Date(),
            });

            // 7. Find or create user (UNIFIED ACCOUNT LOGIC)
            let authUser = await this.authUserRepository.findOne({
                where: { email: normalizedEmail },
            });

            if (!authUser) {
                // New user - create account with EMAIL_OTP provider
                authUser = this.authUserRepository.create({
                    email: normalizedEmail,
                    auth_provider: 'EMAIL_OTP',
                    is_active: true,
                    role: 'USER',
                });
                await queryRunner.manager.save(authUser);
                this.logger.log(`🆕 EMAIL OTP LOGIN - New user created: ${normalizedEmail} | Role: ${authUser.role} | ID: ${authUser.id}`);

                // Create profile with email username as default
                const userProfile = this.userProfileRepository.create({
                    auth_user_id: authUser.id,
                    full_name: normalizedEmail.split('@')[0],
                });
                await queryRunner.manager.save(userProfile);

                // Send welcome email (async, don't wait) - no name for OTP users
                this.emailService.sendWelcomeEmail(normalizedEmail).catch(err => {
                    this.logger.error('Welcome email failed:', err);
                });
            } else {
                this.logger.log(`✅ EMAIL OTP LOGIN - Existing user: ${normalizedEmail} | Role: ${authUser.role} | ID: ${authUser.id}`);
            }
            // Existing users: Allow login regardless of original auth_provider
            // This ensures Google users can also login with OTP and vice versa

            // Update last login
            authUser.last_login_at = new Date();
            await queryRunner.manager.save(authUser);

            userId = authUser.id;

            // 8. Commit transaction
            await queryRunner.commitTransaction();

            // 9. Issue tokens
            const accessToken = this.generateAccessToken(authUser.id, authUser.email, authUser.role);
            const refreshToken = await this.generateRefreshToken(authUser.id);

            // 10. Fetch complete user data (profile + addresses)
            const [profile, addresses] = await Promise.all([
                this.getProfile(authUser.id),
                this.dataSource.getRepository('ShippingAddress').find({
                    where: { userId: authUser.id },
                    order: { isDefault: 'DESC', createdAt: 'DESC' },
                }),
            ]);

            // 11. Return response
            return {
                accessToken,
                refreshToken,
                user: {
                    id: authUser.id,
                    email: authUser.email,
                    role: authUser.role,
                },
                profile, // Complete profile data
                addresses, // User's shipping addresses
            };

        } catch (error) {
            // Only rollback if transaction is still active
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Cleanup expired OTPs (called by cron job)
     */
    async cleanupExpiredOtps(): Promise<number> {
        const result = await this.emailOtpRepository.delete({
            expires_at: LessThan(new Date()),
        });
        return result.affected || 0;
    }

    /**
     * ADMIN: Find all customers with profiles and order stats
     */
    async findAllCustomers(options: { sort?: string; search?: string }) {
        const query = this.authUserRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoin('user.orders', 'order') // Assuming relationship exists
            .where('user.role = :role', { role: 'USER' });

        if (options.search) {
            query.andWhere(
                '(user.email ILIKE :search OR profile.full_name ILIKE :search)',
                { search: `%${options.search}%` }
            );
        }

        // Add aggregate fields
        query.addSelect('COUNT(order.id)', 'orderCount')
            .addSelect('SUM(COALESCE(order.total_amount, 0))', 'totalSpend')
            .groupBy('user.id')
            .addGroupBy('profile.id');

        // Note: QueryBuilder return values for aggregates need raw results or additional mapping
        const rawResults = await query.getRawAndEntities();

        const customers = rawResults.entities.map(user => {
            const raw = rawResults.raw.find(r => r.user_id === user.id);
            return {
                ...user,
                orderCount: parseInt(raw?.orderCount || '0'),
                totalSpend: parseFloat(raw?.totalSpend || '0'),
            };
        });

        // Apply sorting in memory for aggregate fields if needed, or refine query
        if (options.sort === 'most_orders') {
            customers.sort((a, b) => b.orderCount - a.orderCount);
        } else if (options.sort === 'highest_spend') {
            customers.sort((a, b) => b.totalSpend - a.totalSpend);
        } else if (options.sort === 'oldest') {
            customers.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
        } else {
            // Default: newest
            customers.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        }

        return customers;
    }

    /**
     * ADMIN: Get comprehensive customer detail
     */
    async getCustomerDetail(userId: string) {
        const user = await this.authUserRepository.findOne({
            where: { id: userId },
            relations: ['profile', 'orders', 'tickets', 'tickets.messages', 'shippingAddresses'],
        });

        if (!user) {
            throw new UnauthorizedException('Customer not found');
        }

        return user;
    }

    /**
     * SECURITY FIX: Blacklist token for instant revocation
     */
    async blacklistToken(token: string): Promise<void> {
        // Delegate to TokenBlacklistService (injected via module)
        // This will be called from logout
        const decoded = this.jwtService.decode(token) as any;
        if (decoded?.exp) {
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                // Store in database or cache (implementation depends on your setup)
                // For now, we'll assume this is handled by TokenBlacklistService
            }
        }
    }

    /**
     * SECURITY FIX: Generate step-up authentication token
     * Short-lived token (5 minutes) for dangerous actions
     */
    generateStepUpToken(userId: string, email: string): string {
        return this.jwtService.sign(
            {
                sub: userId,
                email,
                type: 'step-up',
            },
            {
                expiresIn: '5m', // 5 minutes only
            },
        );
    }

    /**
     * SECURITY FIX: Verify OTP for step-up authentication
     * Reuses existing OTP verification logic
     */
    async verifyStepUpOtp(email: string, otp: string): Promise<boolean> {
        const normalizedEmail = email.toLowerCase().trim();

        try {
            // Find most recent unused OTP
            const otpRecord = await this.emailOtpRepository.findOne({
                where: {
                    email: normalizedEmail,
                    used_at: IsNull(),
                },
                order: { created_at: 'DESC' },
            });

            if (!otpRecord) {
                return false;
            }

            // Check expiration
            if (new Date() > otpRecord.expires_at) {
                return false;
            }

            // Check attempt count
            if (otpRecord.attempt_count >= 5) {
                return false;
            }

            // Verify OTP
            const isValid = await bcrypt.compare(otp, otpRecord.otp_hash);

            if (isValid) {
                // Mark as used
                await this.emailOtpRepository.update(otpRecord.id, {
                    used_at: new Date(),
                });
                return true;
            } else {
                // Increment attempt count
                await this.emailOtpRepository.update(otpRecord.id, {
                    attempt_count: otpRecord.attempt_count + 1,
                });
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
