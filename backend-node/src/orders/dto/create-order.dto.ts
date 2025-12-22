import { IsNotEmpty, IsArray, IsNumber, IsString, ValidateNested, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsString()
    variantId: string;

    @IsNotEmpty()
    @IsString()
    productNameSnapshot: string;

    @IsNotEmpty()
    @IsString()
    variantLabelSnapshot: string;

    @IsNotEmpty()
    @IsString()
    skuSnapshot: string;

    @IsOptional()
    @IsString()
    imageUrlSnapshot?: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;

    @IsNotEmpty()
    @IsNumber()
    lineTotal: number;
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
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;

    @IsNotEmpty()
    @IsNumber()
    subtotal: number;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

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
