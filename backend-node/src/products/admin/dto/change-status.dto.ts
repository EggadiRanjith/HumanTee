import { IsEnum } from 'class-validator';
import { ProductStatus } from '../../enums/product-status.enum';

/**
 * ChangeStatusDto
 * For controlled status transitions
 */
export class ChangeStatusDto {
    @IsEnum(ProductStatus)
    status: ProductStatus;
}
