import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Cart } from '../entities/cart.entity';
import { CartStatus } from '../entities/cart.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Product } from '../products/entities/product.entity';
import { ProductStatus } from '../products/enums/product-status.enum';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentStatus } from '../payments/enums/payment-status.enum';
import { RazorpayService } from '../payments/razorpay.service';
import { CreateOrderResponse } from './interfaces/create-order-response.interface';
import { EmailService } from '../notifications/email.service';
import { AuthUser } from '../entities/auth-user.entity';
import { ListOrdersDto } from './dto/list-orders.dto';

/**
 * OrdersService
 * Phase 6: Order creation with corrected transaction boundary
 * - DB operations inside transaction
 * - Razorpay API AFTER commit (CORRECTED)
 * - Stock decremented at order creation
 * - Orders are immutable
 */
@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepo: Repository<OrderItem>,
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(AuthUser)
        private userRepo: Repository<AuthUser>,
        private dataSource: DataSource,
        private razorpayService: RazorpayService,
        private emailService: EmailService,
    ) { }

    /**
     * Create order from ACTIVE cart
     * CORRECTED: Razorpay API call OUTSIDE transaction
     */
    async createOrder(userId: string): Promise<CreateOrderResponse> {
        let orderId!: string; // Definite assignment assertion
        let totalAmount!: number; // Definite assignment assertion

        // CORRECTED: Transaction only for DB operations
        await this.dataSource.transaction(async (manager) => {
            // 1. Fetch ACTIVE cart
            const cart = await manager.findOne(Cart, {
                where: { user_id: userId, status: CartStatus.ACTIVE },
                relations: ['items'],
            });

            if (!cart || cart.items.length === 0) {
                throw new BadRequestException('Cart is empty');
            }

            // 2. Validate and lock variants
            totalAmount = 0;
            const validatedItems: Array<{
                item: any;
                variant: ProductVariant;
                product: Product;
            }> = [];

            for (const item of cart.items) {
                // CORRECTED: Lock variant only, no relations
                const variant = await manager.findOne(ProductVariant, {
                    where: { id: item.variant_id },
                    lock: { mode: 'pessimistic_write' },
                });

                if (!variant) {
                    throw new BadRequestException(`Variant not found`);
                }

                // CORRECTED: Fetch product separately
                const product = await manager.findOne(Product, {
                    where: { id: variant.product_id },
                });

                if (!product) {
                    throw new BadRequestException(`Product not found`);
                }

                // Validate variant is active
                if (!variant.is_active) {
                    throw new BadRequestException(
                        `Variant ${variant.sku} is not available`
                    );
                }

                // Validate product is ACTIVE
                if (product.status !== ProductStatus.ACTIVE) {
                    throw new BadRequestException(
                        `Product ${product.title} is not available`
                    );
                }

                // Validate stock
                if (variant.stock_quantity < item.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for ${product.title}. Available: ${variant.stock_quantity}`
                    );
                }

                totalAmount +=
                    parseFloat(item.price_snapshot.toString()) * item.quantity;
                validatedItems.push({ item, variant, product });
            }

            // 3. Create order (CORRECTED: payment_order_id = null)
            const order = manager.create(Order, {
                user_id: userId,
                status: OrderStatus.PENDING,
                total_amount: totalAmount,
                currency: 'INR',
                payment_provider: 'RAZORPAY',
                payment_order_id: null,
            });
            await manager.save(order);
            orderId = order.id;

            // 4. Create order items
            for (const { item, variant, product } of validatedItems) {
                const orderItem = manager.create(OrderItem, {
                    order_id: order.id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price_snapshot: item.price_snapshot,
                    currency: item.currency,
                    variant_label: item.variant_label,
                    product_title: item.product_title,
                });
                await manager.save(orderItem);

                // 5. Decrement stock
                variant.stock_quantity -= item.quantity;
                await manager.save(variant);
            }

            // 6. Mark cart as ORDERED
            cart.status = CartStatus.ORDERED;
            await manager.save(cart);
        });

        // CORRECTED: Razorpay API call AFTER transaction commit
        try {
            const razorpayOrderId = await this.razorpayService.createOrder(
                totalAmount
            );

            // Update order with Razorpay order ID
            await this.orderRepo.update(orderId, {
                payment_order_id: razorpayOrderId,
            });

            // Create payment record
            const payment = this.paymentRepo.create({
                order_id: orderId,
                provider: 'RAZORPAY',
                provider_order_id: razorpayOrderId,
                status: PaymentStatus.CREATED,
                amount: totalAmount,
                currency: 'INR',
            });
            await this.paymentRepo.save(payment);

            return {
                orderId,
                razorpayOrderId,
                amount: totalAmount,
            };
        } catch (error) {
            // Razorpay failed - mark order as FAILED
            await this.orderRepo.update(orderId, {
                status: OrderStatus.FAILED,
            });
            throw new InternalServerErrorException(
                'Payment gateway unavailable'
            );
        }
    }

    /**
     * Get order by ID
     */
    async getOrderById(userId: string, orderId: string): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    /**
     * Get user's orders
     */
    async getUserOrders(userId: string): Promise<Order[]> {
        return this.orderRepo.find({
            where: { user_id: userId },
            relations: ['items'],
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Phase 7: List all orders for admin (CORRECTED: summary only)
     */
    async listOrdersForAdmin(query: ListOrdersDto) {
        const { status, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [orders, total] = await this.orderRepo.findAndCount({
            where,
            relations: ['user', 'items'],
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });

        // CORRECTED: Summary only, no payment details
        return {
            orders: orders.map((order) => ({
                id: order.id,
                userId: order.user_id,
                userEmail: order.user?.email || 'N/A',
                status: order.status,
                totalAmount: parseFloat(order.total_amount.toString()),
                currency: order.currency,
                createdAt: order.created_at,
                itemCount: order.items?.length || 0,
            })),
            total,
            page,
            limit,
        };
    }

    /**
     * Phase 7: Get order details for admin (full details)
     */
    async getOrderForAdmin(orderId: string) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['user', 'items', 'payments'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return {
            id: order.id,
            userId: order.user_id,
            user: {
                email: order.user?.email || 'N/A',
                name: order.user?.email || 'N/A',
            },
            status: order.status,
            totalAmount: parseFloat(order.total_amount.toString()),
            currency: order.currency,
            paymentProvider: order.payment_provider,
            paymentOrderId: order.payment_order_id,
            fulfilledAt: order.fulfilled_at,
            cancelledAt: order.cancelled_at,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            items: order.items?.map((item) => ({
                id: item.id,
                productTitle: item.product_title,
                variantLabel: item.variant_label,
                quantity: item.quantity,
                priceSnapshot: parseFloat(item.price_snapshot.toString()),
                currency: item.currency,
            })),
            payments: order.payments?.map((payment) => ({
                id: payment.id,
                provider: payment.provider,
                status: payment.status,
                amount: parseFloat(payment.amount.toString()),
                createdAt: payment.created_at,
            })),
        };
    }

    /**
     * Phase 7: Fulfill order (manual admin action)
     */
    async fulfillOrder(orderId: string, adminUserId: string) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['user', 'items'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // CORRECTED: Only PAID orders can be fulfilled
        if (order.status !== OrderStatus.PAID) {
            throw new BadRequestException('Only PAID orders can be fulfilled');
        }

        // Update order
        order.status = OrderStatus.FULFILLED;
        order.fulfilled_at = new Date(); // Phase 7: Add timestamp
        await this.orderRepo.save(order);

        // Send email (with idempotency)
        const user = await this.userRepo.findOne({
            where: { id: order.user_id },
        });
        if (user) {
            await this.emailService.sendOrderFulfilled(order, user);
        }

        return {
            success: true,
            orderId: order.id,
            status: order.status,
            message: 'Order marked as fulfilled',
        };
    }

    /**
     * Phase 7: Cancel order manually (CORRECTED: allow PAID or FAILED)
     */
    async cancelOrderManual(
        orderId: string,
        adminUserId: string,
        reason: string
    ) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // CORRECTED: Allow cancellation of PAID or FAILED orders
        if (
            order.status !== OrderStatus.PAID &&
            order.status !== OrderStatus.FAILED
        ) {
            throw new BadRequestException(
                'Only PAID or FAILED orders can be cancelled manually'
            );
        }

        // Update order
        order.status = OrderStatus.CANCELLED;
        order.cancelled_at = new Date(); // Phase 7: Add timestamp
        await this.orderRepo.save(order);

        // NO inventory restore (by design)
        // NO email (manual action, admin handles communication)

        console.log(
            `Order ${orderId} cancelled manually by admin ${adminUserId}. Reason: ${reason}`
        );

        return {
            success: true,
            orderId: order.id,
            status: order.status,
            message: 'Order cancelled manually',
        };
    }
}
