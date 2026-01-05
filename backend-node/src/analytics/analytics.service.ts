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
        const [revenueByDay, customerMetrics, productMetrics, conversionMetrics] = await Promise.all([
            this.getRevenueByDay(period, revenueType),
            this.getCustomerMetrics(period),
            this.getProductMetrics(period),
            this.getConversionMetrics(period),
        ]);

        return {
            metrics,
            revenueByDay,
            customerMetrics,
            productMetrics,
            conversionMetrics,
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
        // Get all products
        const products = await this.productRepo.find({
            relations: ['variants'],
        });

        // Calculate revenue per product (simplified - would need order_items table for accuracy)
        const topProducts = products.slice(0, 5).map(p => ({
            name: p.name,
            revenue: 0, // TODO: Calculate from order_items
            orders: 0, // TODO: Calculate from order_items
            stock: p.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0,
        }));

        // Find low stock products
        const lowStockProducts = products
            .filter(p => {
                const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;
                return totalStock > 0 && totalStock < 10; // Low stock threshold
            })
            .slice(0, 5)
            .map(p => ({
                name: p.name,
                stock: p.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0,
                sold: 0, // TODO: Calculate from order_items
            }));

        // Revenue by category (simplified)
        const revenueByCategory = [
            { category: 'T-Shirts', revenue: 0, percentage: 0 },
            { category: 'Hoodies', revenue: 0, percentage: 0 },
        ];

        return {
            topProducts,
            lowStockProducts,
            revenueByCategory,
        };
    }

    /**
     * Get conversion funnel metrics
     */
    private async getConversionMetrics(period: TimePeriod): Promise<any> {
        // Get orders in period
        const orders = await this.orderRepo.find({
            where: {
                createdAt: Between(period.startDate, period.endDate),
            },
        } as any);

        const ordersCompleted = orders.filter(o => o.status !== OrderStatus.CANCELLED).length;
        const cartCreated = orders.length; // Simplified - would need cart tracking
        const checkoutStarted = orders.filter(o => o.status !== OrderStatus.PENDING).length;

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

        const pending = allOrders.filter(o => o.status === OrderStatus.PENDING).length;
        const processing = allOrders.filter(o => o.status === OrderStatus.PROCESSING).length;
        const fulfilled = allOrders.filter(o => o.status === OrderStatus.FULFILLED).length;
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
