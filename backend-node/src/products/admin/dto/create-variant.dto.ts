import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';

/**
 * CreateVariantDto
 * For creating new product variants
 */
export class CreateVariantDto {
    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    stockQuantity: number;
}
