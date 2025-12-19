import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * CreateProductDto
 * Products always start as DRAFT
 */
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;
}
