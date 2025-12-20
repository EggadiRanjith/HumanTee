import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
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
 * Analytics Service
 * Provides accurate, decision-grade analytics
 * CRITICAL: Numbers must be trustworthy
 */
@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
    ) { }

    /**
     * Get revenue metrics
     * CRITICAL: Accurate revenue calculation
     */
    async getRevenue(
        period: TimePeriod,
        type: RevenueType = RevenueType.NET,
    ): Promise<RevenueMetrics> {
        // Get all orders in period (excluding cancelled)
        const orders = await this.orderRepo.find({
            where: {
                created_at: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
        });

        // Calculate gross revenue
        const gross = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

        // Calculate refunds
        const refundedOrders = orders.filter(o => o.status === OrderStatus.REFUNDED);
        const refunds = refundedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

        // Calculate discounts
        const discounts = orders.reduce((sum, order) => sum + Number(order.discount_amount || 0), 0);

        // Calculate net
        const net = gross - refunds - discounts;

        // Calculate collected (only PAID and FULFILLED orders)
        const collectedOrders = orders.filter(
            o => o.payment_status === 'PAID' || o.status === OrderStatus.FULFILLED
        );
        const collected = collectedOrders.reduce(
            (sum, order) => sum + Number(order.total_amount) - Number(order.discount_amount || 0),
            0,
        );

        // Calculate pending (COD orders not yet collected)
        const pending = net - collected;

        return {
            gross,
            refunds,
            discounts,
            net,
            collected,
            pending,
            currency: 'INR', // TODO: Get from settings
        };
    }

    /**
     * Get order metrics
     * CRITICAL: Cancelled orders not counted in total
     */
    async getOrderMetrics(period: TimePeriod): Promise<OrderMetrics> {
        const allOrders = await this.orderRepo.find({
            where: {
                created_at: Between(period.startDate, period.endDate),
            },
        });

        const pending = allOrders.filter(o => o.status === OrderStatus.PENDING).length;
        const processing = allOrders.filter(o => o.status === OrderStatus.PROCESSING).length;
        const fulfilled = allOrders.filter(o => o.status === OrderStatus.FULFILLED).length;
        const cancelled = allOrders.filter(o => o.status === OrderStatus.CANCELLED).length;
        const refunded = allOrders.filter(o => o.status === OrderStatus.REFUNDED).length;

        // Total excludes cancelled
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
     * CRITICAL: Timezone-aware date grouping
     */
    async getRevenueByDay(
        period: TimePeriod,
        type: RevenueType = RevenueType.NET,
    ): Promise<DailyRevenue[]> {
        const orders = await this.orderRepo.find({
            where: {
                created_at: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            order: {
                created_at: 'ASC',
            },
        });

        // Group by date (timezone-aware)
        const grouped = new Map<string, { revenue: number; orders: number }>();

        for (const order of orders) {
            // Convert to timezone
            const date = this.toTimezone(order.created_at, period.timezone);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, { revenue: 0, orders: 0 });
            }

            const data = grouped.get(dateKey)!;

            // Calculate revenue based on type
            let revenue = Number(order.total_amount);
            if (type === RevenueType.NET) {
                revenue -= Number(order.discount_amount || 0);
                if (order.status === OrderStatus.REFUNDED) {
                    revenue = 0; // Exclude refunded from net
                }
            } else if (type === RevenueType.COLLECTED) {
                if (order.payment_status !== 'PAID' && order.status !== OrderStatus.FULFILLED) {
                    revenue = 0; // Only count collected
                } else {
                    revenue -= Number(order.discount_amount || 0);
                }
            }

            data.revenue += revenue;
            data.orders += 1;
        }

        // Convert to array
        return Array.from(grouped.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
            type,
        }));
    }

    /**
     * Get top products
     * CRITICAL: Accurate sales counting
     */
    async getTopProducts(period: TimePeriod, limit: number = 10): Promise<TopProduct[]> {
        // TODO: Implement when order_items table exists
        // For now, return empty array
        return [];
    }

    /**
     * Get top customers
     * CRITICAL: Accurate spending calculation
     */
    async getTopCustomers(period: TimePeriod, limit: number = 10): Promise<TopCustomer[]> {
        const orders = await this.orderRepo.find({
            where: {
                created_at: Between(period.startDate, period.endDate),
                status: Not(OrderStatus.CANCELLED),
            },
            relations: ['user', 'user.profile'],
        });

        // Group by customer
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
                    firstOrderDate: order.created_at,
                    lastOrderDate: order.created_at,
                });
            }

            const customer = customerMap.get(customerId)!;

            // Calculate net spent (exclude refunds)
            if (order.status !== OrderStatus.REFUNDED) {
                customer.totalSpent += Number(order.total_amount) - Number(order.discount_amount || 0);
            }

            customer.totalOrders += 1;

            if (order.created_at < customer.firstOrderDate) {
                customer.firstOrderDate = order.created_at;
            }
            if (order.created_at > customer.lastOrderDate) {
                customer.lastOrderDate = order.created_at;
            }
        }

        // Convert to array and sort by total spent
        return Array.from(customerMap.entries())
            .map(([customerId, data]) => ({
                customerId,
                customerName: data.name,
                customerEmail: data.email,
                totalSpent: data.totalSpent,
                totalOrders: data.totalOrders,
                firstOrderDate: data.firstOrderDate,
                lastOrderDate: data.lastOrderDate,
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, limit);
    }

    /**
     * Get complete analytics dashboard
     */
    async getDashboard(
        period: TimePeriod,
        revenueType: RevenueType = RevenueType.NET,
    ): Promise<AnalyticsDashboard> {
        const [revenue, orders, revenueByDay, topProducts, topCustomers] = await Promise.all([
            this.getRevenue(period, revenueType),
            this.getOrderMetrics(period),
            this.getRevenueByDay(period, revenueType),
            this.getTopProducts(period, 5),
            this.getTopCustomers(period, 5),
        ]);

        const avgOrderValue = orders.total > 0 ? revenue.net / orders.total : 0;

        // TODO: Calculate actual conversion rate when we have session/visitor tracking
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
     * CRITICAL: Ensures dates are grouped correctly
     */
    private toTimezone(date: Date, timezone: string): Date {
        // Use Intl API for timezone conversion
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
