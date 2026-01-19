import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import {
    Order,
    OrderItem,
    OrderAddress,
    Payment,
    OrderStatusHistory,
    OrderStatus,
    PaymentStatus,
    Product,
    ProductVariant,
    Shipment,
    ShipmentStatus,
} from '../entities';
import { CreateOrderDto } from './dto/create-order.dto';
import { DiscountsService } from '../discounts/discounts.service';
import { OrderDiscount } from '../entities/order-discount.entity';
import { RazorpayService } from '../payments/razorpay.service';
import { randomBytes } from 'crypto';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>,
        private dataSource: DataSource,
        private discountsService: DiscountsService,
        private razorpayService: RazorpayService,
        @Optional() @Inject(RedisService) private redisService?: RedisService,
    ) { }

    /**
     * Generate secure order number
     * Format: HT-XXXXXX (6 random alphanumeric chars)
     */
    private generateSecureOrderNumber(): string {
        const prefix = 'HT';
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars
        const bytes = randomBytes(4);

        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[bytes[i % bytes.length] % chars.length];
        }

        return `${prefix}-${code}`;
    }

    /**
     * Prepare order - Calculate everything and create Razorpay order WITHOUT saving to DB
     * This is called when user clicks "Place Order" - actual order creation happens after payment
     */
    async prepareOrder(userId: string | null, orderData: CreateOrderDto) {
        // 0. IDEMPOTENCY: Validate and check for duplicates
        if (orderData.idempotencyKey) {
            // Validate format (UUID-like)
            if (orderData.idempotencyKey.length < 16 || orderData.idempotencyKey.length > 64) {
                throw new BadRequestException('Invalid idempotency key format');
            }

            // Check Redis for duplicate preparation
            const cacheKey = `order:prep:${userId || 'guest'}:${orderData.idempotencyKey}`;
            try {
                const cached = await this.redisService?.get(cacheKey);
                if (cached) {
                    this.logger.warn(`Idempotent request detected: ${orderData.idempotencyKey}`);
                    return cached; // Redis auto-deserializes JSON
                }
            } catch (err) {
                // Redis unavailable - continue without idempotency (graceful degradation)
                this.logger.warn('Redis unavailable for idempotency check');
            }
        }

        // 1. Fetch products and variants from database
        const productIds = orderData.items.map(i => i.productId);
        const variantIds = orderData.items.map(i => i.variantId);

        const variants = await this.variantRepository.find({
            where: { id: In(variantIds) },
            relations: ['product'],
        });

        if (variants.length !== orderData.items.length) {
            throw new BadRequestException('Some products or variants not found');
        }

        // 2. Calculate prices SERVER-SIDE (ignore frontend prices)
        let subtotal = 0;
        const validatedItems = orderData.items.map(item => {
            const variant = variants.find(v => v.id === item.variantId);
            if (!variant) {
                throw new BadRequestException(`Variant ${item.variantId} not found`);
            }

            // Check stock
            if (variant.stock_quantity < item.quantity) {
                throw new ConflictException(
                    `Only ${variant.stock_quantity} items available for ${variant.product.name} (${variant.size})`
                );
            }

            const lineTotal = Number(variant.price) * item.quantity;
            subtotal += lineTotal;

            return {
                ...item,
                unitPrice: Number(variant.price),
                lineTotal,
                productNameSnapshot: variant.product.name,
                variantLabelSnapshot: variant.size,
                skuSnapshot: variant.sku,
            };
        });

        // 3. Calculate totals
        const taxAmount = subtotal * 0.18; // 18% GST
        const shippingAmount = 0; // Free shipping
        const discountAmount = 0; // TODO: Apply discount if code provided
        const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

        // 4. Create Razorpay order (payment gateway integration)
        const razorpayOrderId = await this.razorpayService.createOrder(totalAmount);

        // 5. Return all calculated data (DO NOT SAVE TO DATABASE)
        const response = {
            razorpayOrderId,
            totalAmount,
            currency: 'INR',
            orderData: {
                userId,
                items: validatedItems,
                shippingAddress: orderData.shippingAddress,
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
            },
        };

        // 6. Cache response for idempotency (30 min TTL)
        if (orderData.idempotencyKey) {
            const cacheKey = `order:prep:${userId || 'guest'}:${orderData.idempotencyKey}`;
            try {
                await this.redisService?.set(cacheKey, response, 1800);
            } catch (err) {
                // Non-critical if cache fails
                this.logger.warn('Failed to cache prepared order');
            }
        }

        return response;
    }

    /**
     * Confirm order - Verify payment and save order to database
     * This is called AFTER successful Razorpay payment
     */
    async confirmOrder(
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
        preparedOrderData: any,
    ): Promise<Order> {
        // 1. Verify Razorpay payment signature
        const isValid = await this.razorpayService.verifyPayment(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        );

        if (!isValid) {
            throw new BadRequestException('Invalid payment signature');
        }

        // 2. Now save order to database in transaction
        return await this.dataSource.transaction(async (manager) => {
            const { userId, items, shippingAddress, subtotal, taxAmount, shippingAmount, discountAmount, totalAmount } = preparedOrderData;

            // Generate secure order number
            const orderNumber = this.generateSecureOrderNumber();

            // Create order with PAID status
            const order = manager.create(Order, {
                orderNumber,
                userId,
                status: OrderStatus.PROCESSING, // Already paid, go straight to processing
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
                currency: 'INR',
                paymentOrderId: razorpayOrderId,
                completedAt: new Date(),
            });
            await manager.save(Order, order);

            // Create order items
            const orderItems = items.map((item: any) =>
                manager.create(OrderItem, {
                    orderId: order.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    productNameSnapshot: item.productNameSnapshot,
                    variantLabelSnapshot: item.variantLabelSnapshot,
                    skuSnapshot: item.skuSnapshot,
                    imageUrlSnapshot: item.imageUrlSnapshot || '',
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    taxAmount: 0,
                    discountAmount: 0,
                    lineTotal: item.lineTotal,
                }),
            );
            await manager.save(OrderItem, orderItems);

            // CRITICAL: Atomic stock decrement with validation
            // Prevents race condition where two concurrent orders can oversell
            for (const item of items) {
                const result = await manager
                    .createQueryBuilder()
                    .update(ProductVariant)
                    .set({ stock_quantity: () => `stock_quantity - ${item.quantity}` })
                    .where('id = :id AND stock_quantity >= :required', {
                        id: item.variantId,
                        required: item.quantity
                    })
                    .execute();

                if (result.affected === 0) {
                    // Either variant doesn't exist OR insufficient stock
                    // This is an edge case - stock was available during prepare but sold out during confirm
                    // ✅ OPTIMIZATION: Variants already fetched at line 88-91 (batch query)
                    // No need to query DB again - just show error without detailed stock info
                    throw new ConflictException(
                        `Stock depleted during checkout for variant ${item.variantId}`
                    );
                }
            }

            // Create shipping address snapshot
            const address = manager.create(OrderAddress, {
                orderId: order.id,
                fullName: shippingAddress.fullName,
                email: shippingAddress.email,
                phone: shippingAddress.phone,
                addressLine1: shippingAddress.addressLine1,
                addressLine2: shippingAddress.addressLine2,
                landmark: shippingAddress.landmark,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
            });
            await manager.save(OrderAddress, address);

            // Create payment record with CAPTURED status
            const payment = manager.create(Payment, {
                orderId: order.id,
                amount: totalAmount,
                currency: 'INR',
                status: PaymentStatus.CAPTURED,
                provider: 'RAZORPAY',
                providerOrderId: razorpayOrderId,
                providerPaymentId: razorpayPaymentId,
                completedAt: new Date(),
            });
            await manager.save(Payment, payment);

            // Create status history
            const history = manager.create(OrderStatusHistory, {
                orderId: order.id,
                fromStatus: undefined,
                toStatus: OrderStatus.PROCESSING,
                changedBy: userId || 'GUEST',
                reason: `Order created and paid via Razorpay: ${razorpayPaymentId}`,
            });
            await manager.save(OrderStatusHistory, history);

            return order;
        });
    }

    /**
     * Create order with atomic transaction
     * SECURITY: Server-side price calculation (frontend prices ignored)
     */
    async createOrder(userId: string | null, orderData: CreateOrderDto): Promise<Order> {
        return await this.dataSource.transaction(async (manager) => {
            // 1. Fetch products and variants from database
            const productIds = orderData.items.map(i => i.productId);
            const variantIds = orderData.items.map(i => i.variantId);

            const variants = await manager.find(ProductVariant, {
                where: { id: In(variantIds) },
                relations: ['product'],
            });

            if (variants.length !== orderData.items.length) {
                throw new BadRequestException('Some products or variants not found');
            }

            // 2. Calculate prices SERVER-SIDE (ignore frontend prices)
            let subtotal = 0;
            const validatedItems = orderData.items.map(item => {
                const variant = variants.find(v => v.id === item.variantId);
                if (!variant) {
                    throw new BadRequestException(`Variant ${item.variantId} not found`);
                }

                // Check stock
                if (variant.stock_quantity < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for ${variant.product.name}`);
                }

                const lineTotal = Number(variant.price) * item.quantity;
                subtotal += lineTotal;

                return {
                    ...item,
                    unitPrice: Number(variant.price),
                    lineTotal,
                    productNameSnapshot: variant.product.name,
                    variantLabelSnapshot: variant.size,
                    skuSnapshot: variant.sku,
                };
            });

            // 3. Calculate totals
            const taxAmount = subtotal * 0.18; // 18% GST
            const shippingAmount = 0; // Free shipping
            const discountAmount = 0; // TODO: Apply discount if code provided
            const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

            // 4. Generate secure order number
            const orderNumber = this.generateSecureOrderNumber();

            // 5. Create Razorpay order (skip if payment bypass enabled)
            let razorpayOrderId: string;
            let initialStatus: OrderStatus;
            let paymentStatus: PaymentStatus;

            const paymentBypassEnabled = process.env.PAYMENT_BYPASS_ENABLED === 'true';

            if (paymentBypassEnabled) {
                // Payment bypass mode: Skip payment, mark as paid
                razorpayOrderId = `dev_${Date.now()}`;
                initialStatus = OrderStatus.PROCESSING; // Skip payment, go straight to processing
                paymentStatus = PaymentStatus.CAPTURED; // Use CAPTURED instead of COMPLETED
                this.logger.log(`⚠️  Payment bypass enabled - Order will auto-complete`);
            } else {
                // Production mode: Create Razorpay order
                razorpayOrderId = await this.razorpayService.createOrder(totalAmount);
                initialStatus = OrderStatus.PENDING_PAYMENT;
                paymentStatus = PaymentStatus.INITIATED;
            }

            // 6. Create order
            const order = manager.create(Order, {
                orderNumber,
                userId,
                status: initialStatus,
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
                currency: 'INR',
                paymentOrderId: razorpayOrderId,
                completedAt: process.env.NODE_ENV === 'development' ? new Date() : undefined,
            });
            await manager.save(Order, order);

            // 7. Create order items (with server-calculated prices)
            const items = validatedItems.map((item) =>
                manager.create(OrderItem, {
                    orderId: order.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    productNameSnapshot: item.productNameSnapshot,
                    variantLabelSnapshot: item.variantLabelSnapshot,
                    skuSnapshot: item.skuSnapshot,
                    imageUrlSnapshot: item.imageUrlSnapshot || '',
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    taxAmount: 0,
                    discountAmount: 0,
                    lineTotal: item.lineTotal,
                }),
            );
            await manager.save(OrderItem, items);

            // 8. CRITICAL: Atomic stock decrement with validation
            // Prevents race condition where two concurrent orders can oversell
            for (const item of validatedItems) {
                const result = await manager
                    .createQueryBuilder()
                    .update(ProductVariant)
                    .set({ stock_quantity: () => `stock_quantity - ${item.quantity}` })
                    .where('id = :id AND stock_quantity >= :required', {
                        id: item.variantId,
                        required: item.quantity
                    })
                    .execute();

                if (result.affected === 0) {
                    // Either variant doesn't exist OR insufficient stock
                    // This is an edge case - stock was available during validation but sold out during order creation
                    const variant = await manager.findOne(ProductVariant, { where: { id: item.variantId } });
                    if (!variant) {
                        throw new BadRequestException(`Variant ${item.variantId} not found`);
                    }
                    throw new ConflictException(
                        `Only ${variant.stock_quantity} items available for ${item.productNameSnapshot} (${item.variantLabelSnapshot})`
                    );
                }
            }

            // 9. Create shipping address snapshot
            const address = manager.create(OrderAddress, {
                orderId: order.id,
                fullName: orderData.shippingAddress.fullName,
                email: orderData.shippingAddress.email,
                phone: orderData.shippingAddress.phone,
                addressLine1: orderData.shippingAddress.addressLine1,
                addressLine2: orderData.shippingAddress.addressLine2,
                landmark: orderData.shippingAddress.landmark,
                city: orderData.shippingAddress.city,
                state: orderData.shippingAddress.state,
                postalCode: orderData.shippingAddress.postalCode,
                country: orderData.shippingAddress.country,
            });
            await manager.save(OrderAddress, address);

            // 10. Create payment record
            const payment = manager.create(Payment, {
                orderId: order.id,
                amount: totalAmount,
                currency: 'INR',
                status: paymentStatus,
                provider: process.env.NODE_ENV === 'development' ? 'DEVELOPMENT' : 'RAZORPAY',
                providerOrderId: razorpayOrderId,
                providerPaymentId: process.env.NODE_ENV === 'development' ? `dev_payment_${Date.now()}` : undefined,
                completedAt: process.env.NODE_ENV === 'development' ? new Date() : undefined,
            });
            await manager.save(Payment, payment);

            // 6. Handle Discounts (Production Hardened)
            if (orderData.discountCode) {
                const discount = await this.discountsService.validateCode(
                    orderData.discountCode,
                    userId,
                    orderData.subtotal
                );

                // Record usage (Prevents race conditions if checked again)
                await this.discountsService.recordUsage(discount.id, order.id, userId);

                // Save Snapshot (Audit Trail)
                const snapshot = manager.create(OrderDiscount, {
                    orderId: order.id,
                    discountId: discount.id,
                    discountCode: discount.code,
                    discountType: discount.type,
                    discountValue: discount.value,
                    appliedAmount: orderData.discountAmount || 0,
                });
                await manager.save(OrderDiscount, snapshot);
            }

            // 12. Create status history entry
            const history = manager.create(OrderStatusHistory, {
                orderId: order.id,
                fromStatus: undefined,
                toStatus: initialStatus,
                changedBy: userId || 'GUEST',
                reason: process.env.NODE_ENV === 'development'
                    ? 'Order created and auto-paid (development mode)'
                    : 'Order created, awaiting payment',
            });
            await manager.save(OrderStatusHistory, history);

            // Return order with Razorpay details
            return {
                ...order,
                razorpayOrderId,
            } as any;
        });
    }

    /**
     * Mark order as PAID (called by webhook)
     */
    async markOrderPaid(orderId: string, paymentId: string): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            // Update order status
            await manager.update(Order, { id: orderId }, {
                status: OrderStatus.PROCESSING,
                completedAt: new Date(),
            });

            // Create status history
            const history = manager.create(OrderStatusHistory, {
                orderId,
                fromStatus: OrderStatus.PENDING_PAYMENT,
                toStatus: OrderStatus.PROCESSING,
                reason: `Payment confirmed: ${paymentId}`,
            });
            await manager.save(OrderStatusHistory, history);
        });
    }

    /**
     * Mark order as PAYMENT_FAILED (called by webhook)
     */
    async markOrderPaymentFailed(orderId: string): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            // Update order status
            await manager.update(Order, { id: orderId }, {
                status: OrderStatus.PAYMENT_FAILED,
            });

            // Create status history
            const history = manager.create(OrderStatusHistory, {
                orderId,
                fromStatus: OrderStatus.PENDING_PAYMENT,
                toStatus: OrderStatus.PAYMENT_FAILED,
                reason: 'Payment failed',
            });
            await manager.save(OrderStatusHistory, history);
        });
    }

    /**
     * Get all orders for a user with filtering and pagination
     */
    async findUserOrders(userId: string, query: { status?: string, page?: number, limit?: number } = {}): Promise<{ orders: Order[], total: number, page: number, totalPages: number }> {
        const { status, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = { userId };
        if (status && status !== 'all') {
            where.status = status;
        }

        const [orders, total] = await this.orderRepository.findAndCount({
            where,
            relations: ['items', 'address', 'payments'],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        // Convert decimals to numbers
        const formattedOrders = orders.map(order => this.formatOrder(order));

        return {
            orders: formattedOrders,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    private formatOrder(order: Order): Order {
        order.totalAmount = parseFloat(order.totalAmount.toString());
        order.subtotal = parseFloat(order.subtotal.toString());
        order.taxAmount = parseFloat(order.taxAmount.toString());
        order.shippingAmount = parseFloat(order.shippingAmount.toString());
        order.discountAmount = parseFloat(order.discountAmount.toString());

        if (order.items) {
            order.items = order.items.map(item => ({
                ...item,
                unitPrice: parseFloat(item.unitPrice.toString()),
                lineTotal: parseFloat(item.lineTotal.toString())
            } as any));
        }
        return order;
    }

    /**
     * Get single order by ID (with authorization check)
     */
    async findOrderById(orderId: string, userId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, userId },
            relations: ['items', 'address', 'payments', 'shipments', 'statusHistory'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.formatOrder(order);
    }

    /**
     * Get order by order number (with authorization check)
     */
    async findOrderByNumber(orderNumber: string, userId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { orderNumber, userId },
            relations: ['items', 'address', 'payments'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    // ==================== ADMIN METHODS ====================

    /**
     * Get all orders for admin (with filters and pagination)
     */
    async findAllOrders(filters: {
        status?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;

        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('order.address', 'address')
            .leftJoinAndSelect('order.payments', 'payments')
            .orderBy('order.createdAt', 'DESC');

        // Apply filters
        if (filters.status) {
            queryBuilder.andWhere('order.status = :status', { status: filters.status });
        }

        if (filters.search) {
            queryBuilder.andWhere(
                '(order.orderNumber LIKE :search OR address.email LIKE :search OR address.fullName LIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        if (filters.startDate) {
            queryBuilder.andWhere('order.createdAt >= :startDate', { startDate: filters.startDate });
        }

        if (filters.endDate) {
            queryBuilder.andWhere('order.createdAt <= :endDate', { endDate: filters.endDate });
        }

        // Get total count
        const total = await queryBuilder.getCount();

        // Get paginated results
        const orders = await queryBuilder.skip(skip).take(limit).getMany();

        return {
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get single order for admin (no user restriction)
     */
    async findOrderByIdAdmin(orderId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'address', 'payments', 'shipments', 'statusHistory'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    /**
     * Update order status with validation and audit trail
     */
    async updateOrderStatus(
        orderId: string,
        newStatus: OrderStatus,
        adminId: string,
        reason?: string
    ): Promise<Order> {
        return await this.dataSource.transaction(async (manager) => {
            // Get order
            const order = await manager.findOne(Order, {
                where: { id: orderId },
                relations: ['statusHistory'],
            });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            const oldStatus = order.status;

            // Validate status transition
            this.validateStatusTransition(oldStatus, newStatus);

            // Update order status
            order.status = newStatus;
            await manager.save(Order, order);

            // Create status history entry
            const history = manager.create(OrderStatusHistory, {
                orderId: order.id,
                fromStatus: oldStatus,
                toStatus: newStatus,
                changedBy: adminId,
                reason: reason || `Status updated by admin`,
            });
            await manager.save(OrderStatusHistory, history);

            return order;
        });
    }

    /**
     * Validate status transitions
     */
    private validateStatusTransition(from: OrderStatus, to: OrderStatus): void {
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PROCESSING, OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED],
            [OrderStatus.PAYMENT_FAILED]: [OrderStatus.CANCELLED],
            [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
            [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
            [OrderStatus.REFUNDED]: [], // Final state
            [OrderStatus.CANCELLED]: [], // Final state
        };

        const allowed = validTransitions[from] || [];
        if (!allowed.includes(to)) {
            const allowedStatuses = allowed.map(s => s.replace(/_/g, ' ').toLowerCase()).join(', ');
            throw new BadRequestException(
                `Invalid status transition. Cannot change from "${from.replace(/_/g, ' ').toLowerCase()}" to "${to.replace(/_/g, ' ').toLowerCase()}". ` +
                `Allowed next statuses: ${allowedStatuses || 'none (final state)'}`
            );
        }
    }

    /**
     * Add shipment tracking
     */
    async addShipment(
        orderId: string,
        shipmentData: { carrier: string; trackingNumber: string; notes?: string }
    ): Promise<Order> {
        return await this.dataSource.transaction(async (manager) => {
            const order = await manager.findOne(Order, { where: { id: orderId } });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            // Create shipment
            const shipment = manager.create(Shipment, {
                orderId: order.id,
                carrier: shipmentData.carrier,
                trackingNumber: shipmentData.trackingNumber,
                status: ShipmentStatus.SHIPPED,
                shippedAt: new Date(),
            });
            await manager.save(Shipment, shipment);

            // Update order status to shipped if not already
            if (order.status === OrderStatus.PROCESSING) {
                order.status = OrderStatus.SHIPPED;
                await manager.save(Order, order);

                // Create status history
                const history = manager.create(OrderStatusHistory, {
                    orderId: order.id,
                    fromStatus: OrderStatus.PROCESSING,
                    toStatus: OrderStatus.SHIPPED,
                    reason: 'Shipment tracking added',
                });
                await manager.save(OrderStatusHistory, history);
            }

            return order;
        });
    }

    /**
     * Get order statistics for admin dashboard
     */
    async getOrderStats(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        ordersByStatus: Record<string, number>;
        recentOrders: Order[];
    }> {
        const [recentOrders, totalOrders] = await this.orderRepository.findAndCount({
            take: 10,
            order: { createdAt: 'DESC' },
            relations: ['items', 'address'],
        });

        // Calculate total revenue
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status != :status', { status: OrderStatus.CANCELLED })
            .getRawOne()
            .then((result) => parseFloat(result.total) || 0);

        // Get orders by status
        const statusCounts = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('order.status')
            .getRawMany();

        const ordersByStatus: Record<string, number> = {};
        statusCounts.forEach((item) => {
            ordersByStatus[item.status] = parseInt(item.count);
        });

        return {
            totalOrders,
            totalRevenue,
            ordersByStatus,
            recentOrders,
        };
    }
    /**
     * Verify Razorpay payment and update order status
     */
    async verifyPayment(data: {
        razorpayPaymentId: string;
        razorpayOrderId: string;
        razorpaySignature: string;
    }): Promise<void> {
        // 1. Verify signature
        const isValid = this.razorpayService.verifyPaymentSignature(
            data.razorpayOrderId,
            data.razorpayPaymentId,
            data.razorpaySignature
        );

        if (!isValid) {
            throw new BadRequestException('Invalid payment signature');
        }

        // 2. Find order
        const order = await this.orderRepository.findOne({
            where: { paymentOrderId: data.razorpayOrderId }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // 3. Mark as paid
        await this.markOrderPaid(order.id, data.razorpayPaymentId);
    }

    /**
     * Process refund for an order
     * SECURITY: Called from admin controller with step-up auth
     * NOTE: This creates a refund record. Actual Razorpay refund must be processed via webhook or manually.
     */
    async refundOrder(
        orderId: string,
        refundData: {
            reason: string;
            amount?: number;
            notes?: string;
            adminId: string;
            adminEmail: string;
        }
    ) {
        // Find order with payments
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['payments'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Find the completed payment (captured status means payment is complete)
        const completedPayment = order.payments?.find(p => p.status === PaymentStatus.CAPTURED);

        if (!completedPayment) {
            throw new BadRequestException('No completed payment found for this order');
        }

        // Determine refund amount (full or partial)
        const refundAmount = refundData.amount || order.totalAmount;

        if (refundAmount > order.totalAmount) {
            throw new BadRequestException('Refund amount cannot exceed order total');
        }

        // Update order status
        order.status = OrderStatus.REFUNDED;
        await this.orderRepository.save(order);

        // Create status history entry
        const statusHistory = this.dataSource.getRepository(OrderStatusHistory).create({
            orderId: order.id,
            fromStatus: order.status,
            toStatus: OrderStatus.REFUNDED,
            changedBy: refundData.adminId,
            reason: `Refund processed by ${refundData.adminEmail}. Reason: ${refundData.reason}`,
        });
        await this.dataSource.getRepository(OrderStatusHistory).save(statusHistory);

        this.logger.log(`Order ${order.orderNumber} refunded by ${refundData.adminEmail}`);

        return {
            orderId: order.id,
            orderNumber: order.orderNumber,
            refundAmount,
            processedBy: refundData.adminEmail,
            processedAt: new Date(),
            reason: refundData.reason,
            notes: refundData.notes,
        };
    }
}
