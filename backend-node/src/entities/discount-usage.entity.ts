import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Discount } from './discount.entity';
import { AuthUser } from './auth-user.entity';

@Entity('discount_usages')
export class DiscountUsage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Discount, (discount) => discount.usages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'discount_id' })
    discount: Discount;

    @Column({ name: 'discount_id' })
    discountId: string;

    @ManyToOne(() => AuthUser, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @CreateDateColumn({ name: 'used_at' })
    usedAt: Date;
}
