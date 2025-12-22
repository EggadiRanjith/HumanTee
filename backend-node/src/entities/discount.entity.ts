import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { DiscountTargetGroup } from './discount-target-group.entity';
import { DiscountUsage } from './discount-usage.entity';

export enum DiscountType {
    PERCENT = 'PERCENT',
    FLAT = 'FLAT',
}

export enum DiscountScope {
    PRODUCT = 'PRODUCT',
    GROUP = 'GROUP',
    GLOBAL = 'GLOBAL',
}

export enum DiscountAudience {
    ALL = 'ALL',
    NEW = 'NEW',
    TOP = 'TOP',
    FREQUENT = 'FREQUENT',
}

@Entity('discounts')
export class Discount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    @Index('idx_discounts_code')
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: DiscountType,
        default: DiscountType.PERCENT,
    })
    type: DiscountType;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    value: number;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency: string;

    @Column({
        type: 'enum',
        enum: DiscountScope,
        default: DiscountScope.PRODUCT,
    })
    scope: DiscountScope;

    @Column({
        type: 'enum',
        enum: DiscountAudience,
        default: DiscountAudience.ALL,
    })
    audience: DiscountAudience;

    @Column({ name: 'min_order_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
    minOrderAmount: number;

    @Column({ name: 'min_user_orders', type: 'int', default: 0 })
    minUserOrders: number;

    @Column({ name: 'min_user_ltv', type: 'decimal', precision: 10, scale: 2, default: 0 })
    minUserLtv: number;

    @Column({ name: 'global_usage_limit', type: 'int', nullable: true })
    globalUsageLimit: number;

    @Column({ name: 'per_user_limit', type: 'int', default: 1 })
    perUserLimit: number;

    @Column({ type: 'int', default: 1 })
    priority: number;

    @Column({ name: 'is_stackable', type: 'boolean', default: false })
    isStackable: boolean;

    @Column({ name: 'max_stack_count', type: 'int', default: 1 })
    maxStackCount: number;

    @Column({ name: 'start_date', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp with time zone', nullable: true })
    endDate: Date;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    @Index('idx_discounts_active_lookup')
    isActive: boolean;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => DiscountTargetGroup, (group) => group.discount)
    targetGroups: DiscountTargetGroup[];

    @OneToMany(() => DiscountUsage, (usage) => usage.discount)
    usages: DiscountUsage[];
}
