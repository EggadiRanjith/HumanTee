import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ShippingService } from './shipping.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('shipping-addresses')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) { }

    @Post()
    create(@Request() req, @Body() createDto: CreateShippingAddressDto) {
        return this.shippingService.create(req.user.userId, createDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.shippingService.findAll(req.user.userId);
    }

    @Get('default')
    findDefault(@Request() req) {
        return this.shippingService.findDefault(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.shippingService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDto: UpdateShippingAddressDto,
    ) {
        return this.shippingService.update(id, req.user.userId, updateDto);
    }

    @Patch(':id/set-default')
    setDefault(@Request() req, @Param('id') id: string) {
        return this.shippingService.setDefault(id, req.user.userId);
    }

    @Patch('default')
    updateDefault(@Request() req, @Body() updateDto: UpdateShippingAddressDto) {
        return this.shippingService.updateDefault(req.user.userId, updateDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.shippingService.remove(id, req.user.userId);
    }
}
