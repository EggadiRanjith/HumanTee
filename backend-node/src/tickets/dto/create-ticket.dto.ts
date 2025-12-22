import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { TicketCategory } from '../../entities';

export class CreateTicketDto {
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    category: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    subject: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    attachments?: { url: string; name: string; type: string; size: number }[];
}
