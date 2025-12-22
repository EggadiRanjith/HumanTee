import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class AddMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000, { message: 'Message is too long. Max 1000 characters.' })
    message: string;

    @IsOptional()
    attachments?: { url: string; name: string; type: string; size: number }[];
}
