import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export enum OrderStatus {
    PENDING_PAYMENT = 'pending_payment',
    PAYMENT_FAILED = 'payment_failed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}

export class AddShipmentDto {
    @IsString()
    carrier: string;

    @IsString()
    trackingNumber: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class OrderFiltersDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsString()
    search?: string; // Search by order number or customer email

    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;
}
