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
