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
import { UserAuditService } from '../auth/user-audit.service';

@Controller('shipping-addresses')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
export class ShippingController {
    constructor(
        private readonly shippingService: ShippingService,
        private readonly userAuditService: UserAuditService,
    ) { }

    @Post()
    async create(@Request() req, @Body() createDto: CreateShippingAddressDto) {
        const result = await this.shippingService.create(req.user.userId, createDto);

        // Log address creation
        const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
        const userAgent = req.headers?.['user-agent'] || 'unknown';

        await this.userAuditService.logAction({
            userId: req.user.userId,
            userEmail: req.user.email,
            eventType: 'ADDRESS_ADDED',
            entityType: 'address',
            entityId: result.id,
            entityName: `${result.city}, ${result.state}`,
            before: null,
            after: result,
            changes: null,
            ipAddress,
            userAgent,
        });

        return result;
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
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDto: UpdateShippingAddressDto,
    ) {
        // Get current address for before state
        const before = await this.shippingService.findOne(id, req.user.userId);
        const result = await this.shippingService.update(id, req.user.userId, updateDto);

        // Log address update
        const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
        const userAgent = req.headers?.['user-agent'] || 'unknown';
        const changes = this.userAuditService.calculateChanges(before, result);

        await this.userAuditService.logAction({
            userId: req.user.userId,
            userEmail: req.user.email,
            eventType: 'ADDRESS_UPDATED',
            entityType: 'address',
            entityId: result.id,
            entityName: `${result.city}, ${result.state}`,
            before,
            after: result,
            changes,
            ipAddress,
            userAgent,
        });

        return result;
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
    async remove(@Request() req, @Param('id') id: string) {
        // Get address before deletion
        const address = await this.shippingService.findOne(id, req.user.userId);
        const result = await this.shippingService.remove(id, req.user.userId);

        // Log address deletion
        const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
        const userAgent = req.headers?.['user-agent'] || 'unknown';

        await this.userAuditService.logAction({
            userId: req.user.userId,
            userEmail: req.user.email,
            eventType: 'ADDRESS_DELETED',
            entityType: 'address',
            entityId: id,
            entityName: `${address.city}, ${address.state}`,
            before: address,
            after: null,
            changes: null,
            ipAddress,
            userAgent,
        });

        return result;
    }
}
