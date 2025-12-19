import { IsInt, Min } from 'class-validator';

/**
 * UpdateCartItemDto
 * Phase 5: Reject quantity < 1 (no silent deletion)
 */
export class UpdateCartItemDto {
    @IsInt()
    @Min(1) // Reject 0 or negative, require explicit DELETE
    quantity: number;
}
