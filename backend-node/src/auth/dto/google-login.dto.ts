import { IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
    @IsString()
    @IsOptional()
    idToken?: string;

    @IsString()
    @IsOptional()
    access_token?: string;
}
