import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class RefundOrderDto {
    @IsString()
    reason: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number; // Partial refund amount (optional, full refund if not provided)

    @IsOptional()
    @IsString()
    notes?: string; // Internal notes for audit trail
}
