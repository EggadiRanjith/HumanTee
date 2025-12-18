import { IsString, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    fullName?: string;

    @IsString()
    @IsOptional()
    @Matches(/^[0-9+\-\s()]{10,15}$/, { message: 'Invalid phone number format' })
    phone?: string;
}
