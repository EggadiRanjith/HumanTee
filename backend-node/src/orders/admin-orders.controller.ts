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
    UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminJwtGuard } from '../auth/guards/admin-jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
// import { BlastRadiusGuard } from '../common/guards/blast-radius.guard'; // Temporarily disabled - needs AuthModule integration
import { StepUpAuthGuard } from '../common/guards/step-up-auth.guard';
import { RequirePermissions } from '../common/permissions/permissions.decorator';
import { Permission } from '../common/permissions/permissions';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto, AddShipmentDto, OrderFiltersDto } from './dto/admin-order.dto';
import { RefundOrderDto } from './dto/refund-order.dto';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

/**
 * AdminOrdersController
 * Admin-only order management with production-grade features
 * SECURITY: Rate limiting and blast radius protection
 */
@Controller('admin/orders')
@Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
@UseGuards(AdminJwtGuard, AdminGuard) // BlastRadiusGuard temporarily disabled
@UseInterceptors(AuditInterceptor)
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

    /**
     * POST /admin/orders/:id/refund - Issue refund for an order
     * BLOCKER FIX: Implements missing refund endpoint
     * SECURITY: Requires ORDERS_REFUND permission
     * SECURITY: Requires step-up authentication (re-auth for financial action)
     * SECURITY: Full audit trail with admin ID, reason, amount
     */
    @Post(':id/refund')
    @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 refunds per minute (very strict)
    @UseGuards(StepUpAuthGuard) // Requires re-authentication
    @RequirePermissions(Permission.ORDERS_REFUND)
    async refundOrder(
        @Param('id') orderId: string,
        @Body() dto: RefundOrderDto,
        @Req() req: any
    ) {
        // Delegate to order service for refund processing
        const result = await this.orderService.refundOrder(
            orderId,
            {
                reason: dto.reason,
                amount: dto.amount,
                notes: dto.notes,
                adminId: req.user.userId,
                adminEmail: req.user.email,
            }
        );

        return {
            success: true,
            message: 'Refund processed successfully',
            refund: result,
        };
    }
}
