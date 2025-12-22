import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    /**
     * Create new order
     * POST /orders
     */
    @Post()
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const order = await this.orderService.createOrder(req.user.userId, createOrderDto);
        return {
            success: true,
            orderNumber: order.orderNumber,
            orderId: order.id,
        };
    }

    /**
     * Get all orders for logged-in user
     * GET /orders
     */
    @Get()
    async getUserOrders(@Request() req) {
        return await this.orderService.findUserOrders(req.user.userId);
    }

    /**
     * Get single order by ID
     * GET /orders/:id
     */
    @Get(':id')
    async getOrderById(@Request() req, @Param('id') orderId: string) {
        return await this.orderService.findOrderById(orderId, req.user.userId);
    }
}
