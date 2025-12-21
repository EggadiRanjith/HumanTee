import { IsOptional, IsString } from 'class-validator';

/**
 * Shop Query DTO
 * Query parameters for filtering products on the shop page
 */
export class ShopQueryDto {
    @IsOptional()
    @IsString()
    productType?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    collection?: string;
}
