import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { OrdersService } from './orders.service';
import { ListOrdersDto } from './dto/list-orders.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';

/**
 * AdminOrdersController
 * Phase 7: Admin-only order management
 * - Read-only visibility
 * - Manual fulfillment/cancellation
 */
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminOrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * GET /admin/orders - List all orders (CORRECTED: summary only)
     */
    @Get()
    async listOrders(@Query() query: ListOrdersDto) {
        return this.ordersService.listOrdersForAdmin(query);
    }

    /**
     * GET /admin/orders/:id - Get order details (full details)
     */
    @Get(':id')
    async getOrder(@Param('id') orderId: string) {
        return this.ordersService.getOrderForAdmin(orderId);
    }

    /**
     * POST /admin/orders/:id/fulfill - Mark order as fulfilled
     */
    @Post(':id/fulfill')
    async fulfillOrder(@Param('id') orderId: string, @Req() req: any) {
        return this.ordersService.fulfillOrder(orderId, req.user.userId);
    }

    /**
     * POST /admin/orders/:id/cancel-manual - Cancel order manually
     */
    @Post(':id/cancel-manual')
    async cancelOrder(
        @Param('id') orderId: string,
        @Body() dto: CancelOrderDto,
        @Req() req: any
    ) {
        return this.ordersService.cancelOrderManual(
            orderId,
            req.user.userId,
            dto.reason
        );
    }
}
