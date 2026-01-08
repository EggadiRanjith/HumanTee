import { IsString, IsEmail } from 'class-validator';

/**
 * DTO for requesting step-up authentication token
 * Used before dangerous actions (delete, refund, etc.)
 */
export class StepUpAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string; // OTP for re-authentication
}
