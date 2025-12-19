import { IsString, IsOptional } from 'class-validator';

/**
 * UpdateProductDto
 * FIX 2: No slug field - slug is immutable
 */
export class UpdateProductDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    // ❌ NO slug field - slug cannot be changed
}
