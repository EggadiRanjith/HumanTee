import { Controller, Get, Post, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('orders')
@Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    /**
     * Create new order
     * POST /orders
     */
    @Post()
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user?.userId || null;
        const order = await this.orderService.createOrder(userId, createOrderDto);
        return {
            success: true,
            orderNumber: order.orderNumber,
            orderId: order.id,
            razorpayOrderId: (order as any).razorpayOrderId,
            amount: order.totalAmount,
            currency: order.currency,
        };
    }

    /**
     * Get all orders for logged-in user
     * GET /orders
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserOrders(@Request() req, @Query() query: any) {
        const result = await this.orderService.findUserOrders(req.user.userId, query);
        return {
            orders: result.orders.map((order) => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                currency: order.currency,
                createdAt: order.createdAt,
                items: order.items?.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    productNameSnapshot: item.productNameSnapshot,
                    imageUrlSnapshot: item.imageUrlSnapshot || '/placeholder.png',
                    variantLabelSnapshot: item.variantLabelSnapshot,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    lineTotal: item.lineTotal,
                })),
            })),
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        };
    }

    /**
     * Get single order by ID
     * GET /orders/:id
     */
    @Get(':id')
    async getOrderById(@Request() req, @Param('id') orderId: string) {
        const userId = req.user?.userId;
        // For now, allow viewing by ID if you have it (guest flow). 
        // In production, might want deeper verification for guests (email check)
        const order = await this.orderService.findOrderByIdAdmin(orderId);

        // Authorization check if user is logged in
        if (userId && order.userId && order.userId !== userId) {
            throw new Error('Unauthorized');
        }

        return {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: order.totalAmount,
            currency: order.currency,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            subtotal: order.subtotal,
            shippingAmount: order.shippingAmount,
            taxAmount: order.taxAmount,
            discountAmount: order.discountAmount,
            address: order.address ? {
                fullName: order.address.fullName,
                addressLine1: order.address.addressLine1,
                addressLine2: order.address.addressLine2,
                city: order.address.city,
                state: order.address.state,
                postalCode: order.address.postalCode,
                country: order.address.country,
            } : null,
            items: order.items?.map((item) => ({
                id: item.id,
                productId: item.productId,
                productNameSnapshot: item.productNameSnapshot,
                imageUrlSnapshot: item.imageUrlSnapshot || '/placeholder.png',
                variantLabelSnapshot: item.variantLabelSnapshot,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                lineTotal: item.lineTotal,
            })),
            payments: order.payments?.map(p => ({
                id: p.id,
                paymentMethod: p.provider,
                status: p.status,
                amount: parseFloat(p.amount.toString())
            }))
        };
    }

    /**
     * Verify payment signature
     * POST /orders/verify-payment
     */
    @Post('verify-payment')
    async verifyPayment(@Body() data: any) {
        await this.orderService.verifyPayment(data);
        return { success: true };
    }
}
