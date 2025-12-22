import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketStatus } from '../../entities';

export class UpdateTicketDto {
    @IsOptional()
    @IsEnum(TicketStatus)
    status?: TicketStatus;

    @IsOptional()
    @IsString()
    priority?: string;

    @IsOptional()
    @IsUUID()
    assignedTo?: string;

    @IsOptional()
    @IsString()
    note?: string; // For status history
}
