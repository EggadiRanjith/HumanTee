import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
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

            // 5. Create Razorpay order
            const razorpayOrderId = await this.razorpayService.createOrder(totalAmount);

            // 6. Create order
            const order = manager.create(Order, {
                orderNumber,
                userId,
                status: OrderStatus.PENDING_PAYMENT,
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
                currency: 'INR',
                paymentOrderId: razorpayOrderId,
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

            // 8. Reduce stock
            for (const item of validatedItems) {
                await manager.decrement(
                    ProductVariant,
                    { id: item.variantId },
                    'stock_quantity',
                    item.quantity
                );
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

            // 10. Create payment record (PENDING)
            const payment = manager.create(Payment, {
                orderId: order.id,
                amount: totalAmount,
                currency: 'INR',
                status: PaymentStatus.INITIATED,
                provider: 'RAZORPAY',
                providerOrderId: razorpayOrderId,
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
                toStatus: OrderStatus.PENDING_PAYMENT,
                changedBy: userId || 'GUEST',
                reason: 'Order created, awaiting payment',
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
            throw new Error(`Invalid status transition from ${from} to ${to}`);
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
}
