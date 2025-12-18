import { IsString, IsInt, IsOptional, Min, IsNumber } from 'class-validator';

export class CartItemDto {
    @IsString()
    productId: string;

    @IsString()
    @IsOptional()
    variantId?: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    productTitle?: string;

    @IsString()
    @IsOptional()
    productImage?: string;

    @IsString()
    @IsOptional()
    size?: string;
}
