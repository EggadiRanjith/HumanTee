import { IsUUID, IsInt, Min } from 'class-validator';

/**
 * AddToCartDto
 * Phase 5: Requires variantId (UUID), no price from frontend
 */
export class AddToCartDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    variantId: string; // REQUIRED

    @IsInt()
    @Min(1) // Minimum 1, reject 0
    quantity: number;

    // NO PRICE FIELD - backend calculates from variant
}
