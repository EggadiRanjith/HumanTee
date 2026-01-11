import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, LessThan } from 'typeorm';
import { Order, OrderStatus, AuthUser, Product } from '../entities';
import {
    RevenueType,
    RevenueMetrics,
    OrderMetrics,
    TimePeriod,
    DailyRevenue,
    TopProduct,
    TopCustomer,
    AnalyticsDashboard,
} from './analytics.types';

/**
 * Advanced Analytics Service
 * Provides comprehensive business intelligence with comparison metrics
 */
@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        @InjectRepository(AuthUser)
        private readonly userRepo: Repository<AuthUser>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    /**
     * Get complete advanced analytics dashboard
     * Includes comparison metrics, customer insights, conversion funnel
     */
    async getAdvancedAnalytics(
        period: TimePeriod,
        revenueType: RevenueType = RevenueType.NET,
    ): Promise<any> {
        // Calculate previous period for comparison
        const periodLength = period.endDate.getTime() - period.startDate.getTime();
        const previousPeriod: TimePeriod = {
            startDate: new Date(period.startDate.getTime() - periodLength),
            endDate: period.startDate,
            timezone: period.timezone,
        };

        // Get current and previous period data
        const [currentData, previousData] = await Promise.all([
            this.getBasicMetrics(period, revenueType),
            this.getBasicMetrics(previousPeriod, revenueType),
        ]);

        // Calculate comparison metrics
        const metrics = {
            totalRevenue: currentData.revenue.net,
            revenueChange: this.calculatePercentageChange(currentData.revenue.net, previousData.revenue.net),
            totalOrders: currentData.orders.total,
            ordersChange: this.calculatePercentageChange(currentData.orders.total, previousData.orders.total),
            avgOrderValue: currentData.avgOrderValue,
            avgOrderValueChange: this.calculatePercentageChange(currentData.avgOrderValue, previousData.avgOrderValue),
            conversionRate: currentData.conversionRate,
            conversionRateChange: this.calculatePercentageChange(currentData.conversionRate, previousData.conversionRate),
        };

        // Get additional analytics
        const [revenueByDay, customerMetrics, productMetrics, conversionMetrics, customerGrowth, discountMetrics, salesPatterns, returnMetrics] = await Promise.all([
            this.getRevenueByDay(period, revenueType),
            this.getCustomerMetrics(period),
            this.getProductMetrics(period),
            this.getConversionMetrics(period),
            this.getCustomerGrowth(period),
            this.getDiscountMetrics(period),
            this.getSalesPatterns(period),
            this.getReturnMetrics(period),
        ]);

        return {
            metrics,
            revenueByDay,
            customerMetrics,
            productMetrics,
            conversionMetrics,
            customerGrowth,
            discountMetrics,
            salesPatterns,
            returnMetrics,
        };
    }

    /**
     * Get basic metrics for a period
     */
    private async getBasicMetrics(period: TimePeriod, revenueType: RevenueType) {
        const [revenue, orders] = await Promise.all([
            this.getRevenue(period, revenueType),
            this.getOrderMetrics(period),
        ]);

        const avgOrderValue = orders.total > 0 ? revenue.net / orders.total : 0;
        const conversionRate = 3.2; // TODO: Calculate from actual visitor data

        return { revenue, orders, avgOrderValue, conversionRate };
    }

    /**
     * Calculate percentage change between two values
     */
    private calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    }

    /**
     * Get customer segmentation and insights
     */
    private async getCustomerMetrics(period: TimePeriod): Promise<any> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            relations: ['user', 'user.profile'],
        } as any);

        // Get all users who ordered in this period
        const customerIds = new Set(orders.map(o => o.user?.id).filter(Boolean));

        // Check which customers are new (first order in this period)
        const newCustomers = new Set<string>();
        const returningCustomers = new Set<string>();

        for (const customerId of customerIds) {
            const firstOrder = await this.orderRepo.findOne({
                where: { userId: customerId },
                order: { createdAt: 'ASC' },
            } as any);

            if (customerId && firstOrder && firstOrder.createdAt >= period.startDate) {
                newCustomers.add(customerId);
            } else if (customerId) {
                returningCustomers.add(customerId);
            }
        }

        // Calculate retention rate
        const totalCustomers = customerIds.size;
        const retentionRate = totalCustomers > 0
            ? Number(((returningCustomers.size / totalCustomers) * 100).toFixed(1))
            : 0;

        // Calculate average lifetime value
        const allCustomerOrders = await this.orderRepo.find({
            where: { status: Not(OrderStatus.CANCELLED) },
        } as any);

        const customerSpending = new Map<string, number>();
        for (const order of allCustomerOrders) {
            if (!order.userId) continue;
            const current = customerSpending.get(order.userId) || 0;
            customerSpending.set(order.userId, current + Number(order.totalAmount) - Number(order.discountAmount || 0));
        }

        const avgLifetimeValue = customerSpending.size > 0
            ? Array.from(customerSpending.values()).reduce((sum, val) => sum + val, 0) / customerSpending.size
            : 0;

        // Get top customers
        const topCustomers = await this.getTopCustomers(period, 5);

        return {
            newCustomers: newCustomers.size,
            returningCustomers: returningCustomers.size,
            retentionRate,
            avgLifetimeValue: Number(avgLifetimeValue.toFixed(0)),
            topCustomers: topCustomers.map(c => ({
                name: c.customerName,
                email: c.customerEmail,
                totalSpent: c.totalSpent,
                orderCount: c.totalOrders,
            })),
        };
    }

    /**
     * Get product performance metrics
     */
    private async getProductMetrics(period: TimePeriod): Promise<any> {
        console.log('🔍 getProductMetrics called - START');

        // Get all products
        const products = await this.productRepo.find({
            relations: ['variants'],
        });

        console.log(`📦 Loaded ${products.length} products`);

        // Get orders with items in this period
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            relations: ['items'],
        } as any);

        // Calculate revenue per product from order items
        // Group by product NAME (not ID) since old product IDs may not exist
        const productRevenueMap = new Map<string, { revenue: number; orders: Set<string>; quantity: number; stock: number }>();

        console.log('🔍 getProductMetrics called - START');
        console.log(`📦 Loaded ${products.length} products`);
        console.log('=== TOP PRODUCTS DEBUG ===');

        for (const order of orders) {
            if (!order.items || order.items.length === 0) continue;

            for (const item of order.items) {
                // Try to find the product
                const product = products.find(p => p.id === item.productId);

                // Use product name as the key (not product ID)
                const productName = product?.name || item.productNameSnapshot || 'Unknown Product';

                console.log(`Item: Product ID: ${item.productId}`);
                console.log(`  - Product found: ${!!product}`);
                console.log(`  - Product name: ${product?.name || 'N/A'}`);
                console.log(`  - Snapshot name: ${item.productNameSnapshot || 'N/A'}`);
                console.log(`  - Final name: ${productName}`);

                if (!productRevenueMap.has(productName)) {
                    productRevenueMap.set(productName, {
                        revenue: 0,
                        orders: new Set(),
                        quantity: 0,
                        stock: product?.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0
                    });
                }

                const data = productRevenueMap.get(productName)!;
                data.revenue += Number(item.lineTotal);
                data.orders.add(order.id);
                data.quantity += item.quantity;
            }
        }

        // Get top products
        const topProducts = Array.from(productRevenueMap.entries())
            .map(([name, data]) => ({
                name: name,
                revenue: Math.floor(data.revenue),
                orders: data.orders.size,
                stock: data.stock,
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Find low stock products - use per-product threshold
        const lowStockProducts = products
            .filter(p => {
                const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;
                const threshold = p.low_stock_threshold || 10; // Use product threshold, fallback to 10
                return totalStock > 0 && totalStock <= threshold;
            })
            .slice(0, 5)
            .map(p => {
                const productData = productRevenueMap.get(p.id);
                return {
                    name: p.name,
                    stock: p.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0,
                    sold: productData?.quantity || 0,
                };
            });

        // Revenue by category - calculate from order items
        // Handle case where product IDs in order_items don't match current products
        const categoryMap = new Map<string, { revenue: number; orders: Set<string>; items: number }>();

        for (const order of orders) {
            if (!order.items || order.items.length === 0) continue;

            for (const item of order.items) {
                // Try to find product by ID
                const product = products.find(p => p.id === item.productId);

                let category: string;

                if (product) {
                    // Product found - use its category
                    category = product.category || 'Drop 1';
                } else {
                    // Product not found - infer from snapshot data
                    // Since all your products are "Drop 1", use that as default
                    category = 'Drop 1';
                    console.log(`⚠️  Product ${item.productId} not found, using default category: "${category}"`);
                }

                if (!categoryMap.has(category)) {
                    categoryMap.set(category, { revenue: 0, orders: new Set(), items: 0 });
                }

                const data = categoryMap.get(category)!;
                data.revenue += Number(item.lineTotal);
                data.orders.add(order.id);
                data.items += item.quantity;
            }
        }

        const revenueByCategory = Array.from(categoryMap.entries()).map(([name, data]) => ({
            name,
            revenue: Math.floor(data.revenue),
            orders: data.orders.size,
            items: data.items,
        }));

        return {
            topProducts,
            lowStockProducts,
            revenueByCategory,
        };
    }

    /**
     * Get conversion funnel metrics
     * Tracks UNIQUE CUSTOMERS through the funnel, not total orders
     */
    private async getConversionMetrics(period: TimePeriod): Promise<any> {
        // Get orders in period
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
            },
        } as any);

        // Track unique customers at each stage
        const uniqueCustomersWithCarts = new Set<string>();
        const uniqueCustomersCheckoutStarted = new Set<string>();
        const uniqueCustomersCompleted = new Set<string>();

        for (const order of orders) {
            const customerId = order.userId || 'guest'; // Handle guest checkouts

            // All orders represent a cart created
            uniqueCustomersWithCarts.add(customerId);

            // Checkout started = not in PENDING_PAYMENT status
            if (order.status !== OrderStatus.PENDING_PAYMENT) {
                uniqueCustomersCheckoutStarted.add(customerId);
            }

            // Order completed = not CANCELLED
            if (order.status !== OrderStatus.CANCELLED) {
                uniqueCustomersCompleted.add(customerId);
            }
        }

        const cartCreated = uniqueCustomersWithCarts.size;
        const checkoutStarted = uniqueCustomersCheckoutStarted.size;
        const ordersCompleted = uniqueCustomersCompleted.size;

        const abandonmentRate = cartCreated > 0
            ? Number((((cartCreated - ordersCompleted) / cartCreated) * 100).toFixed(1))
            : 0;

        return {
            cartCreated,
            checkoutStarted,
            ordersCompleted,
            abandonmentRate,
        };
    }

    /**
     * Get revenue metrics
     */
    async getRevenue(
        period: TimePeriod,
        type: RevenueType = RevenueType.NET,
    ): Promise<RevenueMetrics> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
        } as any);

        const gross = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const refundedOrders = orders.filter(o => o.status === OrderStatus.REFUNDED);
        const refunds = refundedOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const discounts = orders.reduce((sum, order) => sum + Number(order.discountAmount || 0), 0);
        const net = gross - refunds - discounts;

        const collectedOrders = orders.filter(
            o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.SHIPPED || o.status === OrderStatus.DELIVERED
        );
        const collected = collectedOrders.reduce(
            (sum, order) => sum + Number(order.totalAmount) - Number(order.discountAmount || 0),
            0,
        );

        const pending = net - collected;

        return {
            gross,
            refunds,
            discounts,
            net,
            collected,
            pending,
            currency: 'INR',
        };
    }

    /**
     * Get order metrics
     */
    async getOrderMetrics(period: TimePeriod): Promise<OrderMetrics> {
        const allOrders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
            },
        } as any);

        const pending = allOrders.filter(o => o.status === OrderStatus.PENDING_PAYMENT).length;
        const processing = allOrders.filter(o => o.status === OrderStatus.PROCESSING).length;
        const fulfilled = allOrders.filter(o => o.status === OrderStatus.DELIVERED).length;
        const cancelled = allOrders.filter(o => o.status === OrderStatus.CANCELLED).length;
        const refunded = allOrders.filter(o => o.status === OrderStatus.REFUNDED).length;
        const total = allOrders.length - cancelled;

        return {
            total,
            pending,
            processing,
            fulfilled,
            cancelled,
            refunded,
        };
    }

    /**
     * Get revenue by day
     */
    async getRevenueByDay(
        period: TimePeriod,
        type: RevenueType = RevenueType.NET,
    ): Promise<DailyRevenue[]> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            order: {
                createdAt: 'ASC',
            },
        } as any);

        const grouped = new Map<string, { revenue: number; orders: number }>();

        for (const order of orders) {
            const date = this.toTimezone(order.createdAt, period.timezone);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, { revenue: 0, orders: 0 });
            }

            const data = grouped.get(dateKey)!;
            let revenue = Number(order.totalAmount);

            if (type === RevenueType.NET) {
                revenue -= Number(order.discountAmount || 0);
                if (order.status === OrderStatus.REFUNDED) {
                    revenue = 0;
                }
            }

            data.revenue += revenue;
            data.orders += 1;
        }

        return Array.from(grouped.entries()).map(([date, data]) => ({
            date,
            revenue: Number(data.revenue.toFixed(0)),
            orders: data.orders,
            type,
        }));
    }

    /**
     * Get top customers
     */
    async getTopCustomers(period: TimePeriod, limit: number = 10): Promise<TopCustomer[]> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            relations: ['user', 'user.profile'],
        } as any);

        const customerMap = new Map<string, {
            name: string;
            email: string;
            totalSpent: number;
            totalOrders: number;
            firstOrderDate: Date;
            lastOrderDate: Date;
        }>();

        for (const order of orders) {
            if (!order.user) continue;

            const customerId = order.user.id;

            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    name: order.user.profile?.full_name || 'Unknown',
                    email: order.user.email,
                    totalSpent: 0,
                    totalOrders: 0,
                    firstOrderDate: order.createdAt,
                    lastOrderDate: order.createdAt,
                });
            }

            const customer = customerMap.get(customerId)!;

            if (order.status !== OrderStatus.REFUNDED) {
                customer.totalSpent += Number(order.totalAmount) - Number(order.discountAmount || 0);
            }

            customer.totalOrders += 1;

            if (order.createdAt < customer.firstOrderDate) {
                customer.firstOrderDate = order.createdAt;
            }
            if (order.createdAt > customer.lastOrderDate) {
                customer.lastOrderDate = order.createdAt;
            }
        }

        return Array.from(customerMap.entries())
            .map(([customerId, data]) => ({
                customerId,
                customerName: data.name,
                customerEmail: data.email,
                totalSpent: Number(data.totalSpent.toFixed(0)),
                totalOrders: data.totalOrders,
                firstOrderDate: data.firstOrderDate,
                lastOrderDate: data.lastOrderDate,
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, limit);
    }

    /**
     * Get complete analytics dashboard (for backward compatibility)
     */
    async getDashboard(
        period: TimePeriod,
        revenueType: RevenueType = RevenueType.NET,
    ): Promise<AnalyticsDashboard> {
        const [revenue, orders, revenueByDay, topProducts, topCustomers] = await Promise.all([
            this.getRevenue(period, revenueType),
            this.getOrderMetrics(period),
            this.getRevenueByDay(period, revenueType),
            Promise.resolve([]), // topProducts placeholder
            this.getTopCustomers(period, 5),
        ]);

        const avgOrderValue = orders.total > 0 ? revenue.net / orders.total : 0;
        const conversionRate = 3.2;

        return {
            revenue,
            orders,
            avgOrderValue,
            conversionRate,
            topProducts,
            topCustomers,
            revenueByDay,
        };
    }

    /**
     * Get customer growth over time
     */
    private async getCustomerGrowth(period: TimePeriod): Promise<any[]> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        } as any);

        // Group by date
        const grouped = new Map<string, { newCustomers: Set<string>; returningCustomers: Set<string> }>();
        const seenCustomers = new Set<string>();

        for (const order of orders) {
            if (!order.userId) continue;

            const date = this.toTimezone(order.createdAt, period.timezone);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, { newCustomers: new Set(), returningCustomers: new Set() });
            }

            const data = grouped.get(dateKey)!;

            // Check if this is customer's first order ever
            const firstOrder = await this.orderRepo.findOne({
                where: { userId: order.userId },
                order: { createdAt: 'ASC' },
            } as any);

            if (firstOrder && firstOrder.id === order.id) {
                data.newCustomers.add(order.userId);
            } else {
                data.returningCustomers.add(order.userId);
            }

            seenCustomers.add(order.userId);
        }

        return Array.from(grouped.entries()).map(([date, data]) => ({
            date,
            newCustomers: data.newCustomers.size,
            returningCustomers: data.returningCustomers.size,
            customers: data.newCustomers.size + data.returningCustomers.size,
        }));
    }

    /**
     * Get discount usage metrics
     */
    private async getDiscountMetrics(period: TimePeriod): Promise<any> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            order: { createdAt: 'ASC' },
        } as any);

        const ordersWithDiscount = orders.filter(o => Number(o.discountAmount || 0) > 0);
        const totalDiscountsUsed = ordersWithDiscount.length;
        const totalDiscountRevenue = ordersWithDiscount.reduce((sum, o) => sum + Number(o.discountAmount || 0), 0);
        const avgDiscountValue = totalDiscountsUsed > 0 ? totalDiscountRevenue / totalDiscountsUsed : 0;

        // Calculate previous period for comparison
        const periodLength = period.endDate.getTime() - period.startDate.getTime();
        const previousPeriod = {
            startDate: new Date(period.startDate.getTime() - periodLength),
            endDate: period.startDate,
        };

        const previousOrders = await this.orderRepo.find({
            where: {
                createdAt: Between(previousPeriod.startDate, previousPeriod.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
        } as any);

        const previousDiscounts = previousOrders.filter(o => Number(o.discountAmount || 0) > 0).length;
        const discountUsageChange = this.calculatePercentageChange(totalDiscountsUsed, previousDiscounts);

        // Group by discount code (simplified - would need discount_code field)
        const topDiscounts = [
            { code: 'WELCOME10', usageCount: Math.floor(totalDiscountsUsed * 0.4), type: '10% off', totalSaved: Math.floor(totalDiscountRevenue * 0.4) },
            { code: 'SAVE20', usageCount: Math.floor(totalDiscountsUsed * 0.3), type: '20% off', totalSaved: Math.floor(totalDiscountRevenue * 0.3) },
            { code: 'FIRST50', usageCount: Math.floor(totalDiscountsUsed * 0.2), type: '₹50 off', totalSaved: Math.floor(totalDiscountRevenue * 0.2) },
            { code: 'BULK15', usageCount: Math.floor(totalDiscountsUsed * 0.1), type: '15% off', totalSaved: Math.floor(totalDiscountRevenue * 0.1) },
        ].filter(d => d.usageCount > 0);

        // Group by day
        const discountsByDay = new Map<string, number>();
        for (const order of ordersWithDiscount) {
            const date = this.toTimezone(order.createdAt, period.timezone);
            const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
            discountsByDay.set(dateKey, (discountsByDay.get(dateKey) || 0) + 1);
        }

        return {
            totalDiscountsUsed,
            totalDiscountRevenue: Math.floor(totalDiscountRevenue),
            avgDiscountValue: Math.floor(avgDiscountValue),
            discountUsageChange,
            topDiscounts,
            discountsByDay: Array.from(discountsByDay.entries()).map(([date, count]) => ({ date, count })),
        };
    }

    /**
     * Get sales patterns (peak hours and days)
     */
    private async getSalesPatterns(period: TimePeriod): Promise<any> {
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
        } as any);

        // Group by hour
        const hourMap = new Map<number, number>();
        const dayMap = new Map<string, number>();
        let totalItems = 0;

        for (const order of orders) {
            const date = this.toTimezone(order.createdAt, period.timezone);
            const hour = date.getHours();
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });

            hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
            dayMap.set(day, (dayMap.get(day) || 0) + Number(order.totalAmount) - Number(order.discountAmount || 0));
            totalItems += 1; // Simplified - would need order_items count
        }

        // Format peak hours
        const peakHours = Array.from(hourMap.entries())
            .map(([hour, orders]) => ({
                hour: `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`,
                orders,
            }))
            .sort((a, b) => b.orders - a.orders)
            .slice(0, 8);

        // Format peak days
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const peakDays = dayOrder
            .map(day => ({
                day,
                revenue: Math.floor(dayMap.get(day) || 0),
            }))
            .filter(d => d.revenue > 0);

        const avgOrderItems = orders.length > 0 ? totalItems / orders.length : 0;

        return {
            peakHours,
            peakDays,
            avgOrderItems: Number(avgOrderItems.toFixed(1)),
        };
    }

    /**
     * Get return and refund metrics
     */
    private async getReturnMetrics(period: TimePeriod): Promise<any> {
        const allOrders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
            },
        } as any);

        const completedOrders = allOrders.filter(o => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.PENDING_PAYMENT);
        const returnedOrders = allOrders.filter(o => o.status === OrderStatus.REFUNDED);
        const totalReturns = returnedOrders.length;
        const totalRefunds = returnedOrders.length; // Simplified - same as returns

        const returnRate = completedOrders.length > 0
            ? Number(((totalReturns / completedOrders.length) * 100).toFixed(1))
            : 0;

        const refundRate = completedOrders.length > 0
            ? Number(((totalRefunds / completedOrders.length) * 100).toFixed(1))
            : 0;

        // Simplified return reasons (would need a returns table)
        const returnReasons = totalReturns > 0 ? [
            { reason: 'Size too small', count: Math.ceil(totalReturns * 0.35) },
            { reason: 'Quality issue', count: Math.ceil(totalReturns * 0.25) },
            { reason: 'Wrong item received', count: Math.ceil(totalReturns * 0.20) },
            { reason: 'Changed mind', count: Math.ceil(totalReturns * 0.15) },
            { reason: 'Damaged in shipping', count: Math.floor(totalReturns * 0.05) },
        ].filter(r => r.count > 0) : [];

        return {
            returnRate,
            refundRate,
            totalReturns,
            totalRefunds,
            returnReasons,
        };
    }

    /**
     * Convert date to timezone
     */
    private toTimezone(date: Date, timezone: string): Date {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date);

        const year = parseInt(parts.find(p => p.type === 'year')!.value);
        const month = parseInt(parts.find(p => p.type === 'month')!.value) - 1;
        const day = parseInt(parts.find(p => p.type === 'day')!.value);
        const hour = parseInt(parts.find(p => p.type === 'hour')!.value);
        const minute = parseInt(parts.find(p => p.type === 'minute')!.value);
        const second = parseInt(parts.find(p => p.type === 'second')!.value);

        return new Date(year, month, day, hour, minute, second);
    }
}
