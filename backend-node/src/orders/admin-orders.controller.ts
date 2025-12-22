import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Query,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto, AddShipmentDto, OrderFiltersDto } from './dto/admin-order.dto';

/**
 * AdminOrdersController
 * Admin-only order management with production-grade features
 */
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminOrdersController {
    constructor(private readonly orderService: OrderService) { }

    /**
     * GET /admin/orders - List all orders with filters and pagination
     */
    @Get()
    async listOrders(@Query() filters: OrderFiltersDto) {
        const page = filters.page ? parseInt(filters.page) : 1;
        const limit = filters.limit ? parseInt(filters.limit) : 20;

        return this.orderService.findAllOrders({
            status: filters.status,
            search: filters.search,
            startDate: filters.startDate,
            endDate: filters.endDate,
            page,
            limit,
        });
    }

    /**
     * GET /admin/orders/stats - Get order statistics
     */
    @Get('stats')
    async getStats() {
        return this.orderService.getOrderStats();
    }

    /**
     * GET /admin/orders/:id - Get order details
     */
    @Get(':id')
    async getOrder(@Param('id') orderId: string) {
        return this.orderService.findOrderByIdAdmin(orderId);
    }

    /**
     * PATCH /admin/orders/:id/status - Update order status
     */
    @Patch(':id/status')
    async updateStatus(
        @Param('id') orderId: string,
        @Body() dto: UpdateOrderStatusDto,
        @Req() req: any
    ) {
        const order = await this.orderService.updateOrderStatus(
            orderId,
            dto.status,
            req.user.userId,
            dto.reason
        );

        return {
            success: true,
            message: 'Order status updated successfully',
            order,
        };
    }

    /**
     * PATCH /admin/orders/:id/shipment - Add shipment tracking
     */
    @Patch(':id/shipment')
    async addShipment(
        @Param('id') orderId: string,
        @Body() dto: AddShipmentDto
    ) {
        const order = await this.orderService.addShipment(orderId, {
            carrier: dto.carrier,
            trackingNumber: dto.trackingNumber,
            notes: dto.notes,
        });

        return {
            success: true,
            message: 'Shipment tracking added successfully',
            order,
        };
    }
}
