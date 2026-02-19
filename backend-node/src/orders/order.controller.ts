import { Controller, Get, Post, Body, Param, Request, UseGuards, Query, BadRequestException, ConflictException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserAuditService } from '../auth/user-audit.service';
import { RedisService } from '../redis/redis.service';
import { DelhiveryService } from '../delhivery/delhivery.service';

@Controller('orders')
@Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly userAuditService: UserAuditService,
        private readonly redisService: RedisService,
        private readonly delhiveryService: DelhiveryService,
    ) { }

    /**
     * Check pincode serviceability via Delhivery
     * GET /orders/check-serviceability?pincode=110001
     * Public endpoint — no auth required (pre-checkout UX)
     * Cached in Redis for 24 hours per pincode
     */
    @Get('check-serviceability')
    @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 per minute
    async checkServiceability(@Query('pincode') pincode: string) {
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            throw new BadRequestException('Valid 6-digit pincode is required');
        }

        // Check Redis cache first (24h TTL)
        const cacheKey = `serviceability:${pincode}`;
        const cached = await this.redisService.get<any>(cacheKey);
        if (cached) {
            return { ...cached, cached: true };
        }

        const result = await this.delhiveryService.checkPincodeServiceability(pincode);

        // Cache for 24 hours (86400 seconds)
        await this.redisService.set(cacheKey, result, 86400);

        return { ...result, cached: false };
    }

    /**
     * Prepare order - Calculate and create Razorpay order WITHOUT saving to DB
     * POST /orders/prepare
     * SECURITY: Strict rate limit to prevent payment abuse
     */
    @Post('prepare')
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 per minute (stricter than controller)
    async prepareOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user?.userId || null;
        const result = await this.orderService.prepareOrder(userId, createOrderDto) as any;

        return {
            success: true,
            razorpayOrderId: result.razorpayOrderId,
            totalAmount: result.totalAmount,
            currency: result.currency,
            orderData: result.orderData, // Pass this back in confirm request
        };
    }

    /**
     * Confirm order - Verify payment and save to database
     * POST /orders/confirm
     * Requires authentication to link order to user
     * SECURITY: Very strict rate limit for payment confirmation
     */
    @Post('confirm')
    @UseGuards(JwtAuthGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 per minute (very strict)
    async confirmOrder(@Request() req, @Body() data: {
        idempotencyKey: string;  // CRITICAL: Frontend-generated unique key
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
        orderData: any;
    }) {
        // IDEMPOTENCY CHECK: Prevent duplicate order submissions
        if (!data.idempotencyKey) {
            throw new BadRequestException('Idempotency key is required');
        }

        const lockKey = `order:lock:${data.idempotencyKey}`;
        const cacheKey = `order:result:${data.idempotencyKey}`;

        // Check if already processed
        const cached = await this.redisService.get<any>(cacheKey);
        if (cached) {
            return cached;
        }

        // Acquire lock (5-minute timeout) using Redis SET NX
        const redis = this.redisService.getClient();
        const acquired = await redis.set(lockKey, 'processing', 'EX', 300, 'NX');
        if (!acquired) {
            throw new ConflictException('Order is already being processed');
        }

        try {
            // Get userId from authenticated request (not from orderData which might be null)
            const userId = req.user?.userId || null;

            // Override userId in orderData with the authenticated user's ID
            const orderDataWithUserId = {
                ...data.orderData,
                userId: userId,
            };

            const order = await this.orderService.confirmOrder(
                data.razorpayOrderId,
                data.razorpayPaymentId,
                data.razorpaySignature,
                orderDataWithUserId,
            );

            // Cache result for 24 hours
            const result = {
                success: true,
                orderNumber: order.orderNumber,
                orderId: order.id,
            };
            await this.redisService.set(cacheKey, result, 86400);

            // Log order creation for logged-in users
            if (userId && req.user?.email) {
                const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
                const userAgent = req.headers?.['user-agent'] || 'unknown';

                await this.userAuditService.logAction({
                    userId,
                    userEmail: req.user.email,
                    eventType: 'ORDER_CREATED',
                    entityType: 'order',
                    entityId: order.id,
                    entityName: order.orderNumber,
                    before: null,
                    after: {
                        orderNumber: order.orderNumber,
                        totalAmount: order.totalAmount,
                        currency: order.currency,
                        itemCount: data.orderData.items?.length || 0,
                    },
                    changes: null,
                    ipAddress,
                    userAgent,
                });

                // Log payment success
                await this.userAuditService.logAction({
                    userId,
                    userEmail: req.user.email,
                    eventType: 'PAYMENT_SUCCESS',
                    entityType: 'payment',
                    entityId: data.razorpayPaymentId,
                    entityName: order.orderNumber,
                    before: null,
                    after: {
                        orderNumber: order.orderNumber,
                        amount: order.totalAmount,
                        paymentId: data.razorpayPaymentId,
                    },
                    changes: null,
                    ipAddress,
                    userAgent,
                });
            }

            return result;
        } catch (error) {
            // Delete lock on error
            await this.redisService.del(lockKey);
            throw error;
        }
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
                trackingNumber: (order as any).shipments?.[0]?.trackingNumber || null,
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
            })),
            trackingNumber: order.shipments?.[0]?.trackingNumber || null,
            shipmentStatus: order.shipments?.[0]?.status || null,
            shippedAt: order.shipments?.[0]?.shippedAt || null,
            deliveredAt: order.shipments?.[0]?.deliveredAt || null,
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
