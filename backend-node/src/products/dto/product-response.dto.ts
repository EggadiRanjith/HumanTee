import { IsUUID, IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../enums/product-status.enum';

export class VariantResponseDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsOptional()
    color?: string;

    // FIX 4: Will be transformed from DECIMAL string to number in service
    price: number;

    stock: number;

    isActive: boolean;
}

export class ProductResponseDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProductStatus)
    status: ProductStatus;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariantResponseDto)
    variants: VariantResponseDto[];
}
