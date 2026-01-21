import { Controller, Post, Body, UseGuards, Get, Req, Res, UnauthorizedException, Patch } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginAggregationService } from './login-aggregation.service';
import { AdminAuditService } from './admin-audit.service';
import { LoginAuditService } from './login-audit.service';
import { UserAuditService } from './user-audit.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { StepUpAuthDto } from './dto/step-up-auth.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { FlexibleJwtGuard } from './guards/flexible-jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly loginAggregationService: LoginAggregationService,
        private readonly adminAuditService: AdminAuditService,
        private readonly loginAuditService: LoginAuditService,
        private readonly userAuditService: UserAuditService,
    ) { }

    @Post('send-otp')
    @Throttle({ default: { limit: 5, ttl: 3600000 } })  // 5 requests per hour
    async sendOtp(
        @Body() sendOtpDto: SendOtpDto,
        @Req() req: Request,
    ) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

        // Check if user exists and is admin
        const user = await this.authService.findUserByEmail(sendOtpDto.email);
        if (user && user.role?.toLowerCase() === 'admin') {
            throw new UnauthorizedException('Admin users must login through the admin panel');
        }

        return this.authService.sendOtp(sendOtpDto.email, ipAddress);
    }

    /**
     * Admin OTP Send - Separate endpoint for admin panel
     */
    @Post('admin/send-otp')
    @Throttle({ default: { limit: 5, ttl: 3600000 } })  // 5 requests per hour
    async sendAdminOtp(
        @Body() sendOtpDto: SendOtpDto,
        @Req() req: Request,
    ) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

        // Check if user exists
        const user = await this.authService.findUserByEmail(sendOtpDto.email);

        if (!user) {
            throw new UnauthorizedException('Access denied. Admin account not found.');
        }

        // Check if user is admin
        if (user.role?.toLowerCase() !== 'admin') {
            throw new UnauthorizedException('Access denied. Admin privileges required.');
        }

        // User is admin - send OTP
        return this.authService.sendOtp(sendOtpDto.email, ipAddress);
    }

    /**
     * Admin OTP Verify - Uses httpOnly cookies for security
     * CRITICAL: Prevents XSS attacks by not exposing tokens to JavaScript
     */
    @Post('admin/verify-otp')
    @Throttle({ default: { limit: 10, ttl: 60000 } })  // 10 attempts per minute
    async verifyAdminOtp(
        @Body() verifyOtpDto: VerifyOtpDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        const result = await this.authService.verifyOtp(
            verifyOtpDto.email,
            verifyOtpDto.otp,
            ipAddress,
            userAgent,
        );

        // Verify user is admin
        if (result.user.role?.toLowerCase() !== 'admin') {
            throw new UnauthorizedException('Admin access required');
        }

        // SECURITY: Set httpOnly cookies (cannot be accessed by JavaScript)
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('admin_access_token', result.accessToken, {
            httpOnly: true,  // Prevents XSS attacks
            secure: false,  // Allow HTTP in development
            sameSite: 'lax',  // Lax allows cross-IP in development
            maxAge: 15 * 60 * 1000,  // 15 minutes
            path: '/',
        });

        res.cookie('admin_refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: false,  // Allow HTTP in development
            sameSite: 'lax',  // Lax allows cross-IP in development
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            path: '/',
        });

        // Log admin login
        await this.loginAuditService.logLogin({
            userId: result.user.id,
            userEmail: result.user.email,
            userType: 'ADMIN',
            eventType: 'LOGIN',
            loginMethod: 'OTP',
            ipAddress,
            userAgent,
            success: true,
        });

        // Return user data only (NO TOKENS in response body)
        return {
            user: result.user,
            message: 'Admin login successful',
        };
    }

    /**
     * Admin Logout - Clears httpOnly cookies and blacklists token
     * SECURITY FIX: Instant token revocation via blacklist
     */
    @Post('admin/logout')
    @UseGuards(JwtAuthGuard)
    async adminLogout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        // SECURITY FIX: Blacklist the access token immediately
        const accessToken = req.cookies['admin_access_token'];
        if (accessToken) {
            await this.authService.blacklistToken(accessToken);
        }

        // Clear admin cookies
        res.clearCookie('admin_access_token', { path: '/' });
        res.clearCookie('admin_refresh_token', { path: '/' });

        // Log logout
        const user = req.user as any;
        if (user) {
            await this.loginAuditService.logLogin({
                userId: user.id,
                userEmail: user.email,
                userType: 'ADMIN',
                eventType: 'LOGOUT',
                loginMethod: 'OTP',
                ipAddress: req.ip || 'unknown',
                userAgent: req.headers['user-agent'] || 'unknown',
                success: true,
            });
        }

        return { message: 'Logout successful' };
    }

    /**
     * Get Current User - Works for both admin and regular users
     * Uses FlexibleJwtGuard which handles both cookies and Authorization header
     */
    @Get('me')
    @UseGuards(FlexibleJwtGuard)
    async getCurrentUser(@Req() req: Request) {
        // FlexibleJwtGuard already verified the token and attached user to request
        const guardUser = req['user'] as any;

        if (!guardUser || !guardUser.userId) {
            throw new UnauthorizedException('User not found');
        }

        // Get full user data from database
        const fullUser = await this.authService.findUserByEmail(guardUser.email);

        if (!fullUser) {
            throw new UnauthorizedException('User not found');
        }

        // Return user data without sensitive info
        return {
            id: fullUser.id,
            email: fullUser.email,
            role: fullUser.role,
            name: fullUser.profile?.full_name || fullUser.email,
        };
    }



    @Post('verify-otp')
    @Throttle({ default: { limit: 10, ttl: 60000 } })  // 10 attempts per minute
    async verifyOtp(
        @Body() verifyOtpDto: VerifyOtpDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        const result = await this.authService.verifyOtp(
            verifyOtpDto.email,
            verifyOtpDto.otp,
            ipAddress,
            userAgent,
        );

        // SECURITY: Set refresh token cookie (cross-origin compatible)
        // MUST use sameSite: 'none' for cross-origin POST (Vercel → Render)

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,  // MUST be true for SameSite=None (both domains are HTTPS)
            sameSite: 'none',  // REQUIRED for cross-origin cookie setting
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            path: '/',
        });

        // Log login to login_audit_logs (for both admin and user)
        await this.loginAuditService.logLogin({
            userId: result.user.id,
            userEmail: result.user.email,
            userType: result.user.role?.toLowerCase() === 'admin' ? 'ADMIN' : 'USER',
            eventType: 'LOGIN',
            loginMethod: 'OTP',
            ipAddress,
            userAgent,
        });

        // ✅ OPTIMIZED: Return profile and addresses from verifyOtp (already fetched)
        // No need to call buildLoginPayload which would re-fetch addresses
        const redirectUrl = result.user.role?.toLowerCase() === 'admin' ? '/post-login' : '/';

        // Fetch cart separately (not included in verifyOtp)
        const cart = await this.loginAggregationService['cartService'].getActiveCart(result.user.id).catch(() => ({ items: [] }));

        return {
            version: 1,
            accessToken: result.accessToken,
            user: result.user,
            profile: result.profile, // ✅ From verifyOtp
            addresses: result.addresses, // ✅ From verifyOtp
            cart: {
                items: cart.items || [],
                itemCount: cart.items?.length || 0,
            },
            redirectUrl,
        };
    }

    @Post('google')
    async googleLogin(
        @Body() googleLoginDto: GoogleLoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        const result = await this.authService.googleLogin(
            googleLoginDto.idToken,
            ipAddress,
            userAgent,
        );

        // Block admin users from logging in through store
        if (result.user.role?.toLowerCase() === 'admin') {
            throw new UnauthorizedException('Admin users must login through the admin panel');
        }

        // SECURITY: Set refresh token cookie (adapt to environment)
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: isProduction,  // HTTPS only in production
            sameSite: isProduction ? 'none' : 'lax',  // 'none' for cross-origin in prod
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            path: '/',
        });

        // Phase 1.5: Delegate to aggregation service
        const redirectUrl = result.user.role?.toLowerCase() === 'admin' ? '/post-login' : '/';

        // Log login to login_audit_logs (for both admin and user)
        await this.loginAuditService.logLogin({
            userId: result.user.id,
            userEmail: result.user.email,
            userType: result.user.role?.toLowerCase() === 'admin' ? 'ADMIN' : 'USER',
            eventType: 'LOGIN',
            loginMethod: 'Google',
            ipAddress,
            userAgent,
        });

        return this.loginAggregationService.buildLoginPayload(
            result.accessToken,
            result.user,
            redirectUrl,
        );
    }

    @Post('refresh')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }

        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        const result = await this.authService.refreshToken(
            refreshToken,
            ipAddress,
            userAgent,
        );

        // SECURITY: Set new refresh token (adapt to environment)
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: isProduction,  // HTTPS only in production
            sameSite: isProduction ? 'none' : 'lax',  // 'none' for cross-origin in prod
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            path: '/',
        });

        // Log admin token refresh
        if (result.user.role?.toLowerCase() === 'admin') {
            await this.adminAuditService.logAction({
                adminId: result.user.id,
                adminEmail: result.user.email,
                eventType: 'ADMIN_TOKEN_REFRESH',
                entityType: 'auth',
                entityId: result.user.id,
                entityName: result.user.email,
                before: null,
                after: { timestamp: new Date() },
                changes: null,
                ipAddress,
                userAgent,
            });
        } else {
            // Log user (non-admin) token refresh
            await this.userAuditService.logAction({
                userId: result.user.id,
                userEmail: result.user.email,
                eventType: 'USER_TOKEN_REFRESH',
                entityType: 'auth',
                entityId: result.user.id,
                entityName: result.user.email,
                before: null,
                after: { timestamp: new Date() },
                changes: null,
                ipAddress,
                userAgent,
            });
        }

        return {
            accessToken: result.accessToken,
            user: result.user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        // Log admin logout
        if (req.user.role?.toLowerCase() === 'admin') {
            const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';

            await this.adminAuditService.logAction({
                adminId: req.user.userId,
                adminEmail: req.user.email,
                eventType: 'ADMIN_LOGOUT',
                entityType: 'auth',
                entityId: req.user.userId,
                entityName: req.user.email,
                before: null,
                after: { timestamp: new Date() },
                changes: null,
                ipAddress,
                userAgent,
            });
        } else {
            // Log user (non-admin) logout
            const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';

            await this.userAuditService.logAction({
                userId: req.user.userId,
                userEmail: req.user.email,
                eventType: 'USER_LOGOUT',
                entityType: 'auth',
                entityId: req.user.userId,
                entityName: req.user.email,
                before: null,
                after: { timestamp: new Date() },
                changes: null,
                ipAddress,
                userAgent,
            });
        }

        // Clear the refresh token cookie (must match exactly how it was set)
        res.clearCookie('refreshToken', { path: '/' });

        return this.authService.logout(req.user.userId);
    }

    @UseGuards(FlexibleJwtGuard)  // Supports both cookie (admin) and header (regular users)
    @Get('me')
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.userId);
    }

    /**
     * OPTIMIZATION: Aggregated account dashboard endpoint
     * Reduces 3 API calls → 1 (profile + addresses + recent orders)
     * Reduces 4 DB queries → 3 (parallel execution)
     */
    @UseGuards(JwtAuthGuard)
    @Get('account/dashboard')
    async getAccountDashboard(@Req() req: any) {
        return this.authService.getAccountDashboard(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Req() req: any, @Body() updateProfileDto: any) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';

        // Get current profile for before state
        const currentProfile = await this.authService.getProfile(req.user.userId);

        // Update profile
        const result = await this.authService.updateProfile(req.user.userId, updateProfileDto);

        // Log profile update (for non-admin users only, admins are logged separately)
        if (req.user.role?.toLowerCase() !== 'admin') {
            const changes = this.userAuditService.calculateChanges(
                currentProfile.profile,
                result.profile
            );

            await this.userAuditService.logAction({
                userId: req.user.userId,
                userEmail: req.user.email,
                eventType: 'PROFILE_UPDATED',
                entityType: 'profile',
                entityId: req.user.userId,
                entityName: result.profile.fullName || req.user.email,
                before: currentProfile.profile,
                after: result.profile,
                changes,
                ipAddress,
                userAgent,
            });
        }


        return result;
    }

    /**
     * Step-Up Authentication - Generate short-lived token for dangerous actions
     * SECURITY FIX: Implements step-up auth for refunds, deletions, etc.
     */
    @Post('admin/step-up')
    @UseGuards(JwtAuthGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
    async stepUpAuth(
        @Body() stepUpDto: StepUpAuthDto,
        @Req() req: any,
    ) {
        // Verify OTP
        const user = await this.authService.findUserByEmail(stepUpDto.email);

        if (!user || user.id !== req.user.userId) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify OTP (reuse existing OTP verification logic)
        const isValid = await this.authService.verifyStepUpOtp(
            stepUpDto.email,
            stepUpDto.otp,
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // Generate short-lived step-up token (5 minutes)
        const stepUpToken = this.authService.generateStepUpToken(user.id, user.email);

        return {
            stepUpToken,
            expiresIn: 300, // 5 minutes
            message: 'Step-up authentication successful',
        };
    }
}
