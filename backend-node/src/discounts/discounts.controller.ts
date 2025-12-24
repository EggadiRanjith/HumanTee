import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin/discounts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class DiscountsController {
    constructor(private readonly discountsService: DiscountsService) { }

    @Get()
    async findAll() {
        return this.discountsService.findAll();
    }

    @Post()
    async create(@Body() data: any) {
        return this.discountsService.create(data);
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
    async update(@Param('id') id: string, @Body() data: any) {
        return this.discountsService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.discountsService.delete(id);
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
