import { Controller, Post, Body, UseGuards, Get, Req, Res, UnauthorizedException, Patch } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('send-otp')
    @Throttle({ default: { limit: 5, ttl: 3600000 } })  // 5 requests per hour
    async sendOtp(
        @Body() sendOtpDto: SendOtpDto,
        @Req() req: Request,
    ) {
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        return this.authService.sendOtp(sendOtpDto.email, ipAddress);
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

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken: result.accessToken,
            user: result.user,
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

        // Set refresh token as httpOnly cookie with proper security
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return access token and user info (NOT refresh token)
        return {
            accessToken: result.accessToken,
            user: result.user,
        };
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

        // Set new refresh token as httpOnly cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            accessToken: result.accessToken,
            user: result.user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken');

        return this.authService.logout(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Req() req: any, @Body() updateProfileDto: any) {
        return this.authService.updateProfile(req.user.userId, updateProfileDto);
    }
}
