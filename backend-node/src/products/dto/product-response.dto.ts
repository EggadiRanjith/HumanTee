import { IsUUID, IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
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

export class ImageResponseDto {
    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsOptional()
    altText?: string;

    @IsBoolean()
    isPrimary: boolean;

    @IsNumber()
    displayOrder: number;
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

    @IsNumber()
    @IsOptional()
    basePrice?: number;

    @IsNumber()
    @IsOptional()
    compareAtPrice?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariantResponseDto)
    variants: VariantResponseDto[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ImageResponseDto)
    images?: ImageResponseDto[];

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    collection?: string;
}
