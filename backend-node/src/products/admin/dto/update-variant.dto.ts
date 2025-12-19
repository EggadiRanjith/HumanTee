import { IsNumber, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

/**
 * UpdateVariantDto
 * SKU is immutable - not included
 * product_id is immutable - not included
 */
export class UpdateVariantDto {
    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    stockQuantity?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    // ❌ NO sku field - SKU is immutable
    // ❌ NO product_id field - cannot move variant to different product
}
