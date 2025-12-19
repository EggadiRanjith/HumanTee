import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminRoleGuard } from '../../auth/guards/admin-role.guard';
import { AdminVariantsService } from './admin-variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

/**
 * AdminVariantsController
 * FIX 1: Uses guard composition, not inheritance
 */
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard) // FIX 1: Composition
export class AdminVariantsController {
    constructor(
        private readonly adminVariantsService: AdminVariantsService,
    ) { }

    /**
     * POST /admin/products/:productId/variants
     * Create variant for product
     */
    @Post('products/:productId/variants')
    async createVariant(
        @Param('productId') productId: string,
        @Body() dto: CreateVariantDto,
    ) {
        return this.adminVariantsService.createVariant(productId, dto);
    }

    /**
     * GET /admin/products/:productId/variants
     * List all variants for product (admin view)
     */
    @Get('products/:productId/variants')
    async findByProductId(@Param('productId') productId: string) {
        const variants = await this.adminVariantsService.findByProductId(
            productId,
        );
        return { variants };
    }

    /**
     * GET /admin/variants/:id
     * Get single variant (admin view)
     */
    @Get('variants/:id')
    async findById(@Param('id') id: string) {
        return this.adminVariantsService.findById(id);
    }

    /**
     * PATCH /admin/variants/:id
     * Update variant (no SKU change)
     */
    @Patch('variants/:id')
    async updateVariant(
        @Param('id') id: string,
        @Body() dto: UpdateVariantDto,
    ) {
        return this.adminVariantsService.updateVariant(id, dto);
    }
}
