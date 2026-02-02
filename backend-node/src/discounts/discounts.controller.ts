import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { AdminAuditService } from '../auth/admin-audit.service';

@Controller('admin/discounts')
@UseGuards(AdminJwtGuard, AdminGuard)
@UseInterceptors(AuditInterceptor)
export class DiscountsController {
    constructor(
        private readonly discountsService: DiscountsService,
        private readonly adminAuditService: AdminAuditService,
    ) { }

    @Get()
    async findAll() {
        return this.discountsService.findAll();
    }

    @Post()
    async create(@Body() data: any, @Req() req: any) {
        const discount = await this.discountsService.create(data);

        // Audit log
        await this.adminAuditService.logAction({
            adminId: req.user?.id,
            adminEmail: req.user?.email,
            eventType: 'DISCOUNT_CREATE',
            entityType: 'discount',
            entityId: discount.id,
            entityName: discount.code,
            after: { code: discount.code, type: discount.type, value: discount.value },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return discount;
    }

    @Get('validate/:code')
    async validate(@Param('code') code: string) {
        return this.discountsService.validateCode(code);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.discountsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
        const before = await this.discountsService.findOne(id);
        const discount = await this.discountsService.update(id, data);

        // Audit log
        await this.adminAuditService.logAction({
            adminId: req.user?.id,
            adminEmail: req.user?.email,
            eventType: 'DISCOUNT_UPDATE',
            entityType: 'discount',
            entityId: id,
            entityName: discount.code,
            before: { code: before.code, type: before.type, value: before.value, isActive: before.isActive },
            after: { code: discount.code, type: discount.type, value: discount.value, isActive: discount.isActive },
            changes: this.adminAuditService.calculateChanges(before, discount),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        return discount;
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any) {
        const discount = await this.discountsService.findOne(id);
        await this.discountsService.delete(id);

        // Audit log
        await this.adminAuditService.logAction({
            adminId: req.user?.id,
            adminEmail: req.user?.email,
            eventType: 'DISCOUNT_DELETE',
            entityType: 'discount',
            entityId: id,
            entityName: discount.code,
            before: { code: discount.code, type: discount.type, value: discount.value },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
    }
}

// Public discount endpoints (no auth required)
@Controller('discounts')
export class PublicDiscountsController {
    constructor(private readonly discountsService: DiscountsService) { }

    @Post('validate')
    async validateCode(@Body() data: any) {
        try {
            const discount = await this.discountsService.validateCode(data.code, data.userId, data.cartTotal, data.items);

            // Calculate discount amount
            let discountAmount = 0;
            if (discount.type === 'PERCENT') {
                discountAmount = Math.round((data.cartTotal * discount.value) / 100);
            } else {
                discountAmount = Math.min(discount.value, data.cartTotal);
            }

            return {
                valid: true,
                discount: {
                    id: discount.id,
                    code: discount.code,
                    name: discount.name,
                    type: discount.type,
                    value: discount.value,
                    discountAmount,
                    finalTotal: data.cartTotal - discountAmount
                }
            };
        } catch (error) {
            return {
                valid: false,
                error: error.name,
                message: error.message
            };
        }
    }

    @Post('suggestions')
    async getSuggestions(@Body() data: any) {
        return this.discountsService.getSuggestions(data.cartTotal, data.items, data.userId);
    }
}
