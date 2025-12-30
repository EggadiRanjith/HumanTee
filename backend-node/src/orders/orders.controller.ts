import { Controller, Post, Get, Param, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRateLimit } from '../common/decorators/rate-limit.decorators';

/**
 * OrdersController
 * Phase 6: Order creation endpoint
 */
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    /**
     * POST /orders - Create order from ACTIVE cart
     */
    @Post()
    async createOrder(@Req() req: any) {
        const result = await this.ordersService.createOrder(req.user.userId);
        return {
            success: true,
            orderId: result.orderId,
            razorpayOrderId: result.razorpayOrderId,
            amount: result.amount,
            currency: 'INR',
        };
    }

    /**
     * GET /orders - Get user's orders
     */
    @Get()
    async getUserOrders(@Req() req: any) {
        const orders = await this.ordersService.getUserOrders(req.user.userId);
        return {
            orders: orders.map((order) => ({
                id: order.id,
                status: order.status,
                totalAmount: parseFloat(order.total_amount.toString()),
                currency: order.currency,
                paymentProvider: order.payment_provider,
                createdAt: order.created_at,
                items: order.items?.map((item) => ({
                    id: item.id,
                    productTitle: item.product_title,
                    variantLabel: item.variant_label,
                    quantity: item.quantity,
                    priceSnapshot: parseFloat(item.price_snapshot.toString()),
                    currency: item.currency,
                })),
            })),
        };
    }

    /**
     * GET /orders/:id - Get order by ID
     */
    @Get(':id')
    async getOrderById(@Req() req: any, @Param('id') orderId: string) {
        const order = await this.ordersService.getOrderById(
            req.user.userId,
            orderId
        );
        return {
            id: order.id,
            status: order.status,
            totalAmount: parseFloat(order.total_amount.toString()),
            currency: order.currency,
            paymentProvider: order.payment_provider,
            createdAt: order.created_at,
            items: order.items?.map((item) => ({
                id: item.id,
                productTitle: item.product_title,
                variantLabel: item.variant_label,
                quantity: item.quantity,
                priceSnapshot: parseFloat(item.price_snapshot.toString()),
                currency: item.currency,
            })),
        };
    }
}
