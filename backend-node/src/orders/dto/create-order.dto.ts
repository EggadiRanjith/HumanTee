import { IsNotEmpty, IsArray, IsNumber, IsString, ValidateNested, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsString()
    variantId: string;

    @IsOptional()
    @IsString()
    productNameSnapshot?: string;

    @IsOptional()
    @IsString()
    variantLabelSnapshot?: string;

    @IsOptional()
    @IsString()
    skuSnapshot?: string;

    @IsOptional()
    @IsString()
    imageUrlSnapshot?: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber()
    unitPrice?: number;

    @IsOptional()
    @IsNumber()
    lineTotal?: number;
}

export class ShippingAddressDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    addressLine1: string;

    @IsOptional()
    @IsString()
    addressLine2?: string;

    @IsOptional()
    @IsString()
    landmark?: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    postalCode: string;

    @IsNotEmpty()
    @IsString()
    country: string;
}

export class CreateOrderDto {
    @IsOptional()
    @IsUUID()
    idempotencyKey?: string; // Client-provided UUID for duplicate prevention

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;

    @IsOptional()
    @IsNumber()
    subtotal?: number;

    @IsOptional()
    @IsNumber()
    totalAmount?: number;

    @IsOptional()
    @IsNumber()
    taxAmount?: number;

    @IsOptional()
    @IsNumber()
    shippingAmount?: number;

    @IsOptional()
    @IsNumber()
    discountAmount?: number;

    @IsOptional()
    @IsString()
    discountCode?: string;
}
