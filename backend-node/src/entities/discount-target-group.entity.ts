import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Discount } from './discount.entity';
import { Collection } from '../products/entities/collection.entity';

export enum DiscountGroupType {
    COLLECTION = 'COLLECTION',
    TYPE = 'TYPE',
    CATEGORY = 'CATEGORY',
    PRODUCT = 'PRODUCT',
}

@Entity('discount_target_groups')
export class DiscountTargetGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Discount, (discount) => discount.targetGroups, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'discount_id' })
    discount: Discount;

    @Column({ name: 'discount_id' })
    discountId: string;

    @Column({
        name: 'group_type',
        type: 'enum',
        enum: DiscountGroupType,
    })
    groupType: DiscountGroupType;

    @Column({ name: 'group_value_uuid', type: 'uuid', nullable: true })
    groupValueUuid: string;

    @Column({ name: 'group_value_text', type: 'varchar', length: 255, nullable: true })
    groupValueText: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Collection, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_value_uuid' })
    collection: Collection;
}
