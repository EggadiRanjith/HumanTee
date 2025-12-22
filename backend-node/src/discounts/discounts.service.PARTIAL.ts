import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, In } from 'typeorm';
import { Discount, DiscountType, DiscountScope, DiscountAudience } from '../entities/discount.entity';
import { DiscountTargetGroup, DiscountGroupType } from '../entities/discount-target-group.entity';
import { DiscountUsage } from '../entities/discount-usage.entity';
import { Order } from '../orders/entities/order.entity';
import { AuthUser } from '../entities/auth-user.entity';
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
        // Financial Integrity Checks
        if (data.type === DiscountType.PERCENT && (data.value < 0 || data.value > 100)) {
            throw new BadRequestException('Percentage must be between 0 and 100');
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
                    groupValueText: undefined, // Explicitly set to undefined for PRODUCT type
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
            // Delete existing target groups
            await this.targetGroupRepository.delete({ discountId: id });

            // Create new target groups
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
            // Handle selectedProducts format
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

    // ... rest of the service methods (validateCode, evaluateAudience, recordUsage, checkItemMatch)
    // Keep all existing methods below this point
}
