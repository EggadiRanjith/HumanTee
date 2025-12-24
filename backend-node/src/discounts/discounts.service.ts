import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Not } from 'typeorm';
import { Discount, DiscountType, DiscountScope, DiscountAudience } from '../entities/discount.entity';
import { DiscountTargetGroup, DiscountGroupType } from '../entities/discount-target-group.entity';
import { DiscountUsage } from '../entities/discount-usage.entity';
import { AuthUser } from '../entities/auth-user.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';

@Injectable()
export class DiscountsService {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
        @InjectRepository(DiscountTargetGroup)
        private readonly targetGroupRepository: Repository<DiscountTargetGroup>,
        @InjectRepository(DiscountUsage)
        private readonly usageRepository: Repository<DiscountUsage>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) { }

    async create(data: any) {
        // Enforce Financial Integrity (Constraint v2.1)
        if (data.type === DiscountType.PERCENT && (data.value < 0 || data.value > 100)) {
            throw new BadRequestException('Percentage discount must be between 0 and 100');
        }
        if (data.type === DiscountType.FLAT && data.value < 0) {
            throw new BadRequestException('Flat discount value cannot be negative');
        }

        const existing = await this.discountRepository.findOne({ where: { code: data.code.toUpperCase() } });
        if (existing) throw new ConflictException('Discount code already exists');

        const discountEntity = this.discountRepository.create({
            ...data,
            code: data.code.toUpperCase(),
        });

        // Use type assertion to avoid Union type returned by save()
        const savedDiscount = (await this.discountRepository.save(discountEntity)) as any;

        // Handle Target Groups
        if (data.targetGroups && data.targetGroups.length > 0) {
            const groups = data.targetGroups.map((group: any) =>
                this.targetGroupRepository.create({
                    discountId: savedDiscount.id,
                    groupType: group.groupType,
                    groupValueUuid: (group.groupType === DiscountGroupType.COLLECTION || group.groupType === DiscountGroupType.PRODUCT) ? group.groupValue : null,
                    groupValueText: (group.groupType !== DiscountGroupType.COLLECTION && group.groupType !== DiscountGroupType.PRODUCT) ? group.groupValue : null,
                })
            );
            await this.targetGroupRepository.save(groups);
        } else if (data.scope === DiscountScope.PRODUCT && data.selectedProducts) {
            // Fallback for direct product IDs if not formatted as targetGroups
            const groups = data.selectedProducts.map((productId: string) =>
                this.targetGroupRepository.create({
                    discountId: savedDiscount.id,
                    groupType: DiscountGroupType.PRODUCT,
                    groupValueUuid: productId,
                    groupValueText: null, // Must be null for PRODUCT type to satisfy check constraint
                })
            );
            await this.targetGroupRepository.save(groups);
        }

        return this.findOne(savedDiscount.id);
    }

    async findAll() {
        return this.discountRepository.find({
            relations: ['targetGroups'],
            where: { deletedAt: IsNull() },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const discount = await this.discountRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['targetGroups'],
        });
        if (!discount) throw new NotFoundException('Discount not found');
        return discount;
    }

    async update(id: string, data: any) {
        const discount = await this.findOne(id);

        // Financial Integrity Checks
        if (data.type === DiscountType.PERCENT && (data.value < 0 || data.value > 100)) {
            throw new BadRequestException('Percentage must be between 0 and 100');
        }
        if (data.type === DiscountType.FLAT && data.value < 0) {
            throw new BadRequestException('Flat discount value cannot be negative');
        }

        // Check code uniqueness if code is being changed
        if (data.code && data.code.toUpperCase() !== discount.code) {
            const existing = await this.discountRepository.findOne({
                where: { code: data.code.toUpperCase(), id: Not(id) }
            });
            if (existing) throw new ConflictException('Discount code already exists');
        }

        // Update discount fields
        Object.assign(discount, {
            ...data,
            code: data.code ? data.code.toUpperCase() : discount.code,
        });

        await this.discountRepository.save(discount);

        // Update target groups if provided
        if (data.targetGroups !== undefined) {
            await this.targetGroupRepository.delete({ discountId: id });

            if (data.targetGroups.length > 0) {
                const groups = data.targetGroups.map((group: any) =>
                    this.targetGroupRepository.create({
                        discountId: id,
                        groupType: group.groupType,
                        groupValueUuid: (group.groupType === DiscountGroupType.COLLECTION || group.groupType === DiscountGroupType.PRODUCT) ? group.groupValue : null,
                        groupValueText: (group.groupType !== DiscountGroupType.COLLECTION && group.groupType !== DiscountGroupType.PRODUCT) ? group.groupValue : null,
                    })
                );
                await this.targetGroupRepository.save(groups);
            }
        } else if (data.selectedProducts !== undefined) {
            await this.targetGroupRepository.delete({ discountId: id });

            if (data.selectedProducts.length > 0) {
                const groups = data.selectedProducts.map((productId: string) =>
                    this.targetGroupRepository.create({
                        discountId: id,
                        groupType: DiscountGroupType.PRODUCT,
                        groupValueUuid: productId,
                        groupValueText: undefined,
                    })
                );
                await this.targetGroupRepository.save(groups);
            }
        }

        return this.findOne(id);
    }

    async delete(id: string) {
        const discount = await this.findOne(id);
        discount.deletedAt = new Date();
        await this.discountRepository.save(discount);
        return { message: 'Discount deleted successfully' };
    }

    async validateCode(code: string, userId?: string, cartTotal?: number, items?: any[]) {
        const discount = await this.discountRepository.findOne({
            where: {
                code: code.toUpperCase(),
                isActive: true,
                deletedAt: IsNull()
            },
            relations: ['targetGroups']
        });

        if (!discount) throw new NotFoundException('Invalid or expired discount code');

        // 1. Time Window Check
        const now = new Date();
        if (discount.startDate > now) throw new BadRequestException('Discount is not active yet');
        if (discount.endDate && discount.endDate < now) throw new BadRequestException('Discount has expired');

        // 2. Minimum Order Check
        if (cartTotal && cartTotal < discount.minOrderAmount) {
            throw new BadRequestException(`Minimum order of ₹${discount.minOrderAmount} required`);
        }

        // 3. Global Usage Limit Check
        if (discount.globalUsageLimit !== null) {
            const usageCount = await this.usageRepository.count({ where: { discountId: discount.id } });
            if (usageCount >= discount.globalUsageLimit) {
                throw new BadRequestException('Discount limit reached');
            }
        }

        // 4. Per User Limit Check
        if (userId) {
            const userUsageCount = await this.usageRepository.count({
                where: { discountId: discount.id, userId }
            });
            if (userUsageCount >= discount.perUserLimit) {
                throw new BadRequestException('You have already used this discount code');
            }

            // 5. Audience Evaluation
            if (discount.audience !== DiscountAudience.ALL) {
                await this.evaluateAudience(discount, userId);
            }
        } else if (discount.audience !== DiscountAudience.ALL) {
            throw new BadRequestException('This discount is reserved for registered customers');
        }

        // 6. Scope/Items Check
        if (discount.scope !== DiscountScope.GLOBAL && items && items.length > 0) {
            const matchingItems = await Promise.all(
                items.map(item => this.checkItemMatch(item, discount.targetGroups))
            );
            const hasMatch = matchingItems.some(match => match === true);
            if (!hasMatch) {
                throw new BadRequestException('None of the items in your cart are eligible for this discount');
            }
        }

        return discount;
    }

    private async checkItemMatch(item: any, targets: DiscountTargetGroup[]): Promise<boolean> {
        if (!targets || targets.length === 0) return true;

        for (const target of targets) {
            if (target.groupType === DiscountGroupType.PRODUCT) {
                if (item.productId === target.groupValueUuid) return true;
            } else if (target.groupType === DiscountGroupType.CATEGORY) {
                if (item.category === target.groupValueText) return true;
            } else if (target.groupType === DiscountGroupType.TYPE) {
                if (item.productType === target.groupValueText) return true;
            } else if (target.groupType === DiscountGroupType.COLLECTION) {
                // Check if product belongs to collection
                const map = await this.orderRepository.manager.getRepository('product_collection_map').findOne({
                    where: { product_id: item.productId, collection_id: target.groupValueUuid }
                });
                if (map) return true;
            }
        }
        return false;
    }

    async evaluateAudience(discount: Discount, userId: string) {
        if (discount.audience === DiscountAudience.NEW) {
            const user = await this.orderRepository.manager.findOne(AuthUser, { where: { id: userId } });
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (!user || user.created_at < thirtyDaysAgo) {
                throw new BadRequestException('This discount is only for new customers (first 30 days)');
            }
        }

        if (discount.audience === DiscountAudience.FREQUENT || discount.minUserOrders > 0) {
            const threshold = discount.minUserOrders || 5;
            const orderCount = await this.orderRepository.count({
                where: { user_id: userId, status: Not(In([OrderStatus.CANCELLED])) } as any
            });
            if (orderCount < threshold) {
                throw new BadRequestException(`This discount requires at least ${threshold} previous orders`);
            }
        }

        if (discount.audience === DiscountAudience.TOP || discount.minUserLtv > 0) {
            const threshold = discount.minUserLtv || 10000;
            const stats = await this.orderRepository
                .createQueryBuilder('order')
                .select('SUM(order.total_amount)', 'ltv')
                .where('order.user_id = :userId', { userId })
                .andWhere('order.status != :status', { status: OrderStatus.CANCELLED })
                .getRawOne();

            const ltv = parseFloat(stats.ltv) || 0;
            if (ltv < threshold) {
                throw new BadRequestException(`This discount is reserved for our top customers (Min spent: ₹${threshold})`);
            }
        }
    }

    async recordUsage(discountId: string, orderId: string, userId?: string) {
        const usage = this.usageRepository.create({
            discountId,
            orderId,
            userId,
        });
        return this.usageRepository.save(usage);
    }

    /**
     * Get discount suggestions for a cart
     * Returns all applicable discounts sorted by savings (best first)
     */
    async getSuggestions(cartTotal: number, items: any[], userId?: string) {
        const now = new Date();

        // Find all active discounts
        const allDiscounts = await this.discountRepository.find({
            where: {
                isActive: true,
                deletedAt: IsNull(),
            },
            relations: ['targetGroups'],
        });

        const suggestions: any[] = [];

        for (const discount of allDiscounts) {
            try {
                // Check time window
                if (discount.startDate && discount.startDate > now) continue;
                if (discount.endDate && discount.endDate < now) continue;

                // Check minimum order amount
                if (discount.minOrderAmount && cartTotal < discount.minOrderAmount) continue;

                // Check scope (products/collections)
                if (discount.scope === DiscountScope.PRODUCT) {
                    const matches = await this.checkItemMatchForSuggestions(items, discount.targetGroups);
                    if (!matches) continue;
                }

                // Check global usage limit
                if (discount.globalUsageLimit) {
                    const totalUses = await this.usageRepository.count({
                        where: { discountId: discount.id }
                    });
                    if (totalUses >= discount.globalUsageLimit) continue;
                }

                // Check user-specific limits (if user provided)
                if (userId) {
                    // Check audience restrictions
                    if (discount.audience && discount.audience !== DiscountAudience.ALL) {
                        try {
                            await this.evaluateAudience(discount, userId);
                        } catch (error) {
                            continue; // Skip if not eligible
                        }
                    }

                    // Check per-user usage limit
                    if (discount.perUserLimit) {
                        const userUses = await this.usageRepository.count({
                            where: { discountId: discount.id, userId }
                        });
                        if (userUses >= discount.perUserLimit) continue;
                    }
                }

                // Calculate savings
                const savings = this.calculateDiscountAmount(discount, cartTotal);

                suggestions.push({
                    id: discount.id,
                    code: discount.code,
                    name: discount.name,
                    type: discount.type,
                    value: discount.value,
                    savings: savings,
                    description: discount.description || '',
                    expiresAt: discount.endDate,
                    scope: discount.scope,
                    minOrderAmount: discount.minOrderAmount,
                });
            } catch (error) {
                // Skip discounts that cause errors
                continue;
            }
        }

        // Sort by savings (descending), then by expiry (soonest first)
        suggestions.sort((a, b) => {
            // Primary: highest savings
            if (b.savings !== a.savings) {
                return b.savings - a.savings;
            }

            // Secondary: expiring soonest (if both have expiry)
            if (a.expiresAt && b.expiresAt) {
                return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
            }

            // Tertiary: with expiry before without
            if (a.expiresAt && !b.expiresAt) return -1;
            if (!a.expiresAt && b.expiresAt) return 1;

            return 0;
        });

        // Mark the best discount
        if (suggestions.length > 0) {
            suggestions[0].isBest = true;
        }

        return {
            suggestions,
            count: suggestions.length,
        };
    }

    /**
     * Helper: Calculate discount amount
     */
    private calculateDiscountAmount(discount: Discount, cartTotal: number): number {
        if (discount.type === DiscountType.PERCENT) {
            return Math.round((cartTotal * discount.value) / 100);
        } else {
            return Math.min(discount.value, cartTotal); // Can't discount more than cart total
        }
    }

    /**
     * Helper: Check if items match discount scope (for suggestions only)
     */
    private async checkItemMatchForSuggestions(items: any[], targets: DiscountTargetGroup[]): Promise<boolean> {
        if (!targets || targets.length === 0) return true; // GLOBAL scope

        for (const item of items) {
            for (const target of targets) {
                if (target.groupType === DiscountGroupType.PRODUCT) {
                    if (item.productId === target.groupValueUuid) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
